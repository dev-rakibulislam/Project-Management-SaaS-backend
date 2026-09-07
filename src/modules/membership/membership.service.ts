import { MembershipStatus, OrganizationRole } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
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

	return membership;
};

const getAllMembershipService = async (orgId: string) => {
	const membership = await prisma.membership.findMany({
		where: { organizationId: orgId, deleteAt: null },
	});
	return membership;
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
