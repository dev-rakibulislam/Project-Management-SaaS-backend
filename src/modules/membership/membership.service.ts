import { MembershipStatus } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { createMembershipPayload } from "./membership.validation";

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

const getMemberships = async () => {
	// TODO
};

const getMembership = async () => {
	// TODO
};

const updateMembership = async () => {
	// TODO
};

const deleteMembership = async () => {
	// TODO
};

export const membershipService = {
	addMemberService,
	getMemberships,
	getMembership,
	updateMembership,
	deleteMembership,
};
