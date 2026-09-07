import {
	MembershipStatus,
	OrganizationRole,
	OrganizationStatus,
} from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { AuthenticatedUser } from "../../types/auth";
import { makeNoise } from "../../utils/makeNoise";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import type {
	createOrganizationPayload,
	updateOrganizationPayload,
} from "./organizations.validation";

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

	const { organization, result } = await prisma.$transaction(async (tx) => {
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
		return { result, organization };
	});

	await makeNoise({
		entityId: organization.id,
		action: "ORGANIZATION_CREATED",
		entityType: "ORGANIZATION",
		organizationId: organization.id,
	});

	return result;
};

const getMyOrganizationService = async (user: AuthenticatedUser) => {
	const result = await prisma.membership.findMany({
		where: {
			userId: user.id,
			status: MembershipStatus.ACTIVE,
			organization: {
				deletedAt: null,
			},
		},
		select: {
			organization: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
		},
	});

	return result.map((item) => item.organization);
};

const getMySingleOrganizationService = async (id: string) => {
	const result = await prisma.organization.findUnique({
		where: {
			id,
			deleteAt: null,
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
) => {
	const pagination = getPagination(page, limit);

	const [members, total] = await prisma.$transaction([
		prisma.membership.findMany({
			where: {
				organizationId: orgId,
				status: OrganizationStatus.ACTIVE,
				deleteAt: null,
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

const updateOrganizationService = async (
	orgId: string,
	data: updateOrganizationPayload,
) => {
	const result = await prisma.organization.update({
		where: { id: orgId },
		data,
	});

	await makeNoise({
		entityId: result.id,
		action: "ORGANIZATION_UPDATED",
		entityType: "ORGANIZATION",
		organizationId: result.id,
	});

	return result;
};

export const organizationsService = {
	createOrganizationService,
	getMyOrganizationService,
	getMySingleOrganizationService,
	getSingleOrganizationMemberService,
	updateOrganizationService,
};
