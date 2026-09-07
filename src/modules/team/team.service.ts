import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { createTeamPayload } from "./team.validation";

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
			select: {
				name: true,
				description: true,
				id: true,
				organizationId: true,
			},
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

export const teamService = {
	createTeamService,
	getAllTeamService,
};
