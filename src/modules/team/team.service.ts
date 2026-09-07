import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { makeNoise } from "../../utils/makeNoise";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import { QueryParams } from "../../utils/query";
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

	await makeNoise({
		action: "TEAM_CREATE",
		entityId: team.id,
		entityType: "TEAM",
		organizationId,
	});

	return team;
};

const getAllTeamService = async (
	organizationId: string,
	query: QueryParams,
) => {
	const { page, limit } = query;

	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "name"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		organizationId,
		deletedAt: null,

		...(query.search && {
			OR: [
				{
					name: {
						contains: query.search,
						mode: "insensitive" as const,
					},
				},
			],
		}),
	};

	const [teams, totalTeams] = await prisma.$transaction([
		prisma.team.findMany({
			where,

			skip,
			take: currentLimit,

			orderBy: {
				[sortBy]: query.sortOrder,
			},

			omit: {
				deletedAt: true,
			},
		}),

		prisma.team.count({
			where,
		}),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalTeams),
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

	await makeNoise({
		action: "TEAM_UPDATE",
		entityId: team.id,
		entityType: "TEAM",
		organizationId,
		metadata: {
			old: {
				name: team.name,
				description: team.description,
			},
			new: {
				name: updatedTeam.name,
				description: updatedTeam.description,
			},
		},
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

	await makeNoise({
		action: "TEAM_DELETE",
		entityId: team.id,
		entityType: "TEAM",
		organizationId,
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
