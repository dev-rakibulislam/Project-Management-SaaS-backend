import { MembershipStatus } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { addTeamMemberValidationPayload } from "./teammembership.validation";

const addTeamMemberService = async (
	teamId: string,
	organizationId: string,
	membershipId: addTeamMemberValidationPayload,
) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
			deletedAt: null,
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

	// Check already added
	const existingTeamMembership = await prisma.teamMembership.findUnique({
		where: {
			teamId_membershipId: {
				teamId,
				membershipId: membershipId.membershipId,
			},
		},
	});

	if (existingTeamMembership) {
		throw new AppError(409, "Member is already in this team.");
	}

	const teamMembership = await prisma.teamMembership.create({
		data: {
			teamId,
			membershipId: membershipId.membershipId,
		},
	});

	return teamMembership;
};

const getTeammemberships = async () => {
	// TODO
};

const getTeammembership = async () => {
	// TODO
};

const updateTeammembership = async () => {
	// TODO
};

const deleteTeammembership = async () => {
	// TODO
};

export const teammembershipService = {
	addTeamMemberService,
	getTeammemberships,
	getTeammembership,
	updateTeammembership,
	deleteTeammembership,
};
