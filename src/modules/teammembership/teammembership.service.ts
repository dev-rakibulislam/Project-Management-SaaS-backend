import { MembershipStatus } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { addTeamMemberValidationPayload } from "./teammembership.validation";

const addTeamMemberService = async (
	teamId: string,
	organizationId: string,
	membershipId: addTeamMemberValidationPayload,
) => {
	console.log({
		teamId,
		organizationId,
		membershipId: membershipId.membershipId,
	});

	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found.");
	}

	const membership = await prisma.membership.findFirst({
		where: {
			id: membershipId.membershipId,
			organizationId,
			status: MembershipStatus.ACTIVE,
			deleteAt: null,
		},
	});

	if (!membership) {
		throw new AppError(404, "Membership not found in this organization.");
	}
	const existingMember = await prisma.teamMembership.findUnique({
		where: {
			teamId_membershipId: {
				teamId,
				membershipId: membershipId.membershipId,
			},
		},
	});

	if (existingMember) {
		throw new AppError(409, "Member is already in this team.");
	}

	const teamMember = await prisma.teamMembership.create({
		data: {
			teamId,
			membershipId: membershipId.membershipId,
		},
	});

	return teamMember;
};

const getAllTeamMembersService = async (
	teamId: string,
	organizationId: string,
) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found.");
	}

	const teamMembers = await prisma.teamMembership.findMany({
		where: {
			teamId,
		},
		include: {
			membership: {
				select: {
					id: true,
					userId: true,
					role: true,
					status: true,
				},
			},
		},
	});

	return teamMembers;
};

const getSingleTeamMemberService = async (
	teamId: string,
	teamMemberId: string,
	organizationId: string,
) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found.");
	}

	const teamMember = await prisma.teamMembership.findFirst({
		where: {
			id: teamMemberId,
			teamId,
		},
		include: {
			membership: {
				select: {
					id: true,
					userId: true,
					role: true,
					status: true,
				},
			},
		},
	});

	if (!teamMember) {
		throw new AppError(404, "Team member not found.");
	}

	return teamMember;
};

const deleteTeamMemberService = async (
	teamId: string,
	teamMemberId: string,
	organizationId: string,
) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found.");
	}

	const teamMember = await prisma.teamMembership.findFirst({
		where: {
			id: teamMemberId,
			teamId,
		},
	});

	if (!teamMember) {
		throw new AppError(404, "Team member not found.");
	}

	await prisma.teamMembership.delete({
		where: {
			id: teamMember.id,
		},
	});
	return {};
};

export const teammembershipService = {
	addTeamMemberService,
	getAllTeamMembersService,
	getSingleTeamMemberService,
	deleteTeamMemberService,
};
