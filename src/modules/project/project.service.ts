import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { makeNoise } from "../../utils/makeNoise";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import { QueryParams } from "../../utils/query";
import type {
	assignProjectTeamValidationPayload,
	createProjectValidationPayload,
	updateProjectValidationPayload,
} from "./project.validation";

const createProjectService = async (
	organizationId: string,
	userId: string,
	data: createProjectValidationPayload,
) => {
	if (data.teamId) {
		const team = await prisma.team.findFirst({
			where: {
				id: data.teamId,
				organizationId,
				deletedAt: null,
			},
		});

		if (!team) {
			throw new AppError(404, "Team not found in this organization.");
		}
	}

	const project = await prisma.project.create({
		data: {
			name: data.name,
			description: data.description,
			organizationId,
			teamId: data.teamId,
			status: data.status,
			startDate: data.startDate,
			endDate: data.endDate,
			createdById: userId,
		},
	});

	await makeNoise({
		action: "PROJECT_CREATED",
		entityId: project.id,
		entityType: "PROJECT",
		organizationId,
	});

	return project;
};

const assignProjectTeamService = async (
	projectId: string,
	organizationId: string,
	teamId: assignProjectTeamValidationPayload,
) => {
	// Project check
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found.");
	}

	// Team must belong to same organization
	const team = await prisma.team.findFirst({
		where: {
			id: teamId.teamId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!team) {
		throw new AppError(404, "Team not found in this organization.");
	}

	const updatedProject = await prisma.project.update({
		where: {
			id: projectId,
		},
		data: {
			teamId: team.id,
		},
		include: {
			team: true,
		},
	});

	await makeNoise({
		action: "PROJECT_UPDATED",
		entityId: project.id,
		entityType: "PROJECT",
		organizationId,
		metadata: {
			teamId: team.id,
		},
	});

	return updatedProject;
};

const getProjectService = async (projectId: string, organizationId: string) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			description: true,
			organizationId: true,
			teamId: true,
			status: true,
			startDate: true,
			endDate: true,
			createdById: true,
			createdAt: true,
			updatedAt: true,

			team: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found.");
	}

	return project;
};

const getAllProjectService = async (
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
				{
					description: {
						contains: query.search,
						mode: "insensitive" as const,
					},
				},
			],
		}),
	};

	const [projects, totalProjects] = await prisma.$transaction([
		prisma.project.findMany({
			where,

			skip,
			take: currentLimit,

			orderBy: {
				[sortBy]: query.sortOrder,
			},

			select: {
				id: true,
				name: true,
				description: true,
				organizationId: true,
				teamId: true,
				status: true,
				startDate: true,
				endDate: true,
				createdById: true,
				createdAt: true,
				updatedAt: true,

				team: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		}),

		prisma.project.count({
			where,
		}),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalProjects),
		projects,
	};
};

const updateProjectService = async (
	projectId: string,
	organizationId: string,
	payload: updateProjectValidationPayload,
) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found.");
	}

	if (payload.teamId) {
		const team = await prisma.team.findFirst({
			where: {
				id: payload.teamId,
				organizationId,
				deletedAt: null,
			},
		});

		if (!team) {
			throw new AppError(404, "Team not found in this organization.");
		}
	}

	const updatedProject = await prisma.project.update({
		where: {
			id: project.id,
		},
		data: {
			...(payload.name !== undefined && {
				name: payload.name,
			}),

			...(payload.description !== undefined && {
				description: payload.description,
			}),

			...(payload.teamId !== undefined && {
				teamId: payload.teamId,
			}),

			...(payload.status !== undefined && {
				status: payload.status,
			}),

			...(payload.startDate !== undefined && {
				startDate: payload.startDate,
			}),

			...(payload.endDate !== undefined && {
				endDate: payload.endDate,
			}),
		},
	});

	await makeNoise({
		action: "PROJECT_UPDATED",
		entityId: project.id,
		entityType: "PROJECT",
		organizationId,
		metadata: {
			payload,
		},
	});

	return updatedProject;
};

const deleteProjectService = async (
	projectId: string,
	organizationId: string,
) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found.");
	}

	await prisma.project.update({
		where: {
			id: project.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});

	await makeNoise({
		action: "PROJECT_DELETED",
		entityId: project.id,
		entityType: "PROJECT",
		organizationId,
	});

	return {};
};

export const projectService = {
	createProjectService,
	assignProjectTeamService,
	getProjectService,
	getAllProjectService,
	updateProjectService,
	deleteProjectService,
};
