import { MembershipStatus, OrganizationRole } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { QueryParams } from "../../types/query";
import { makeNoise } from "../../utils/makeNoise";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import type {
	createMembershipPayload,
	updateMemberShipRolePayload,
	updateMemberShipStatusPayload,
} from "./membership.validation";

const addMemberService = async (
	organizationId: string,
	payload: createMembershipPayload,
) => {
	const { role, userId } = payload;

	const existingMember = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId,
				organizationId,
			},
		},
	});

	if (existingMember) {
		throw new AppError(409, "User is already a member.");
	}

	const checkUserRegister = await prisma.user.findUnique({
		where: { id: userId, isActive: true, deletedAt: null },
	});

	if (!checkUserRegister) {
		throw new AppError(404, "User not found");
	}

	const membership = await prisma.membership.create({
		data: {
			userId,
			organizationId,
			role,
			status: MembershipStatus.ACTIVE,
		},
	});

	await makeNoise({
		entityId: membership.id,
		action: "MEMBER_ADDED",
		entityType: "MEMBER",
		userId,
	});

	return membership;
};
const getAllMembershipService = async (orgId: string, query: QueryParams) => {
	const { page, limit } = query;

	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "role", "status"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		organizationId: orgId,
		deleteAt: null,

		...(query.search && {
			user: {
				OR: [
					{
						name: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
					{
						email: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
				],
			},
		}),
	};

	const [memberships, totalMemberships] = await prisma.$transaction([
		prisma.membership.findMany({
			where,

			skip,
			take: currentLimit,

			orderBy: {
				[sortBy]: query.sortOrder,
			},

			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		}),

		prisma.membership.count({
			where,
		}),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalMemberships),
		memberships,
	};
};

const getSingleMembershipService = async (
	organizationId: string,
	memberId: string,
) => {
	const membership = await prisma.membership.findFirst({
		where: {
			id: memberId,
			organizationId,
			deleteAt: null,
		},
		omit: { deleteAt: true },
		include: {
			user: {
				select: {
					email: true,
					name: true,
				},
			},
		},
	});

	if (!membership) {
		throw new AppError(404, "Member not found.");
	}

	return membership;
};

const updateMembershipRoleService = async (
	organizationId: string,
	memberId: string,
	role: updateMemberShipRolePayload,
) => {
	const membership = await prisma.membership.findFirst({
		where: {
			id: memberId,
			organizationId,
			deleteAt: null,
		},
	});

	if (!membership) {
		throw new AppError(404, "Member not found.");
	}

	if (membership.role === OrganizationRole.OWNER) {
		throw new AppError(403, "Owner role cannot be changed.");
	}

	const updatedMembership = await prisma.membership.update({
		where: {
			id: membership.id,
		},
		data: {
			role: role.role,
		},
	});

	await makeNoise({
		entityId: updatedMembership.id,
		action: "MEMBER_ADDED",
		entityType: "MEMBER",
		organizationId,
		metadata: {
			memberId: memberId,
		},
	});

	return updatedMembership;
};

const updateMemberStatusService = async (
	organizationId: string,
	memberId: string,
	status: updateMemberShipStatusPayload,
) => {
	const membership = await prisma.membership.findFirst({
		where: {
			id: memberId,
			organizationId,
			deleteAt: null,
		},
	});

	if (!membership) {
		throw new AppError(404, "Member not found.");
	}

	if (membership.role === OrganizationRole.OWNER) {
		throw new AppError(403, "Owner status cannot be changed.");
	}

	const updatedMembership = await prisma.membership.update({
		where: {
			id: membership.id,
		},
		data: {
			status: status.status,
		},
	});

	await makeNoise({
		entityId: updatedMembership.id,
		action: "MEMBER_STATUS_CHANGED",
		entityType: "MEMBER",
		organizationId,
		metadata: {
			oldStatus: membership.status,
			NewStatus: updatedMembership.status,
		},
	});

	return updatedMembership;
};

const deleteMemberService = async (
	organizationId: string,
	memberId: string,
) => {
	const membership = await prisma.membership.findFirst({
		where: {
			id: memberId,
			organizationId,
			deleteAt: null,
		},
	});

	if (!membership) {
		throw new AppError(404, "Member not found.");
	}

	const deletedMembership = await prisma.membership.update({
		where: {
			id: membership.id,
		},
		data: {
			deleteAt: new Date(),
		},
	});

	await makeNoise({
		entityId: deletedMembership.id,
		action: "MEMBER_REMOVED",
		entityType: "MEMBER",
		organizationId,
	});

	return deletedMembership;
};

export const membershipService = {
	addMemberService,
	getAllMembershipService,
	getSingleMembershipService,
	updateMembershipRoleService,
	updateMemberStatusService,
	deleteMemberService,
};
