import { OrganizationRole, OrganizationStatus } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { AuthenticatedUser } from "../../types/auth";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
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
				role: OrganizationRole.OWNER,
			},
			include: { organization: { omit: { deletedAt: true } } },
		});
		return result;
	});

	return transaction;
};

const getMyOrganizationService = async (user: AuthenticatedUser) => {
	const result = await prisma.organization.findMany({
		where: {
			ownerId: user.id,
		},
		select: {
			id: true,
			name: true,
			slug: true,
		},
	});

	return result;
};

const getMySingleOrganizationService = async (id: string) => {
	const result = await prisma.organization.findUnique({
		where: {
			id,
		},
		omit: {
			deletedAt: true,
		},
		include: {
			_count: {
				select: {
					memberships: true,
				},
			},
		},
	});

	return result;
};

const getSingleOrganizationMemberService = async (
	orgId: string,
	page = 1,
	limit = 20,
	search?: string,
) => {
	const pagination = getPagination(page, limit);

	const [members, total] = await prisma.$transaction([
		prisma.membership.findMany({
			where: {
				organizationId: orgId,
				status: OrganizationStatus.ACTIVE,
			},
			skip: pagination.skip,
			take: pagination.limit,
			select: {
				id: true,
				userId: true,
				organizationId: true,
				role: true,
				status: true,
				createdAt: true,
				updatedAt: true,

				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		}),

		prisma.membership.count({
			where: {
				organizationId: orgId,
			},
		}),
	]);

	return {
		members,
		metaData: getPaginationMeta(pagination.page, pagination.limit, total),
	};
};

export const organizationsService = {
	createOrganizationService,
	getMyOrganizationService,
	getMySingleOrganizationService,
	getSingleOrganizationMemberService,
};
