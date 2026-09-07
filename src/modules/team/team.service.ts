import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { createTeamPayload, updateTeamPayload } from "./team.validation";

const createTeamService = async (
	organizationId: string,
	data: createTeamPayload,
) => {
	const team = await prisma.team.create({
		data: {
			name: data.name,
			description: data.description,
			organizationId,
		},
	});

	return team;
};

const getAllTeamService = async (organizationId: string) => {
	const [teams, totalTeams] = await prisma.$transaction([
		prisma.team.findMany({
			where: {
				organizationId,
				deletedAt: null,
			},
			omit: { deletedAt: true },
		}),

		prisma.team.count({
			where: {
				organizationId,
				deletedAt: null,
			},
		}),
	]);

	return {
		totalTeams,
		teams,
	};
};

const getSingleTeamService = async (organizationId: string, teamId: string) => {
	const team = await prisma.team.findFirst({
		where: {
			id: teamId,
			organizationId,
			deletedAt: null,
		},
		omit: {
			deletedAt: true,
		},
		include: {
			projects: {
				select: {
					id: true,
					name: true,
					deletedAt: false,
					description: true,
				},
			},
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found.");
	}

	return team;
};

const updateTeamService = async (
	organizationId: string,
	teamId: string,
	payload: updateTeamPayload,
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

	const updatedTeam = await prisma.team.update({
		where: {
			id: team.id,
		},
		data: payload,
	});

	return updatedTeam;
};

const deleteTeamService = async (organizationId: string, teamId: string) => {
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

	await prisma.team.update({
		where: {
			id: team.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});

	return {};
};

export const teamService = {
	createTeamService,
	getAllTeamService,
	getSingleTeamService,
	updateTeamService,
	deleteTeamService,
};
