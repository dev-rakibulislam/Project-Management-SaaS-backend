import { OrganizationRole } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { AuthenticatedUser } from "../../types/auth";
import type { createOrganizationPayload } from "./organizations.validation";

const createOrganizationService = async (
	payload: createOrganizationPayload,
	user: AuthenticatedUser,
) => {
	const { name, slug } = payload;
	let finalUniqueSlug = slug;

	if (slug) {
		const existingSlug = await prisma.organization.findUnique({
			where: { slug },
		});

		if (existingSlug) {
			throw new AppError(400, "Slug already taken by another organization.");
		}

		finalUniqueSlug = slug;
	} else {
		const slugify = (value: string) => {
			return value
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
				.replace(/-+/g, "-")
				.replace(/^-|-$/g, "");
		};
		const baseSlug = slugify(name);
		let uniqueSlug = "";
		while (true) {
			const randomNumber = Math.floor(420 + Math.random() * 9999);
			uniqueSlug = `${baseSlug}-${randomNumber}`;

			const exists = await prisma.organization.findUnique({
				where: { slug: uniqueSlug },
			});

			if (!exists) {
				break;
			}
		}

		finalUniqueSlug = uniqueSlug;
	}

	const transaction = await prisma.$transaction(async (tx) => {
		const organization = await tx.organization.create({
			data: {
				name,
				ownerId: user.id,
				slug: finalUniqueSlug,
			},
		});

		const result = await tx.membership.create({
			data: {
				organizationId: organization.id,
				userId: user.id,
				role: OrganizationRole.ORG_ADMIN,
			},
			include: { organization: { omit: { deletedAt: true } } },
		});
		return result;
	});

	return transaction;
};

export const organizationsService = {
	createOrganizationService,
};
