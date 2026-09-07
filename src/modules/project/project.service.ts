import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
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

const getAllProjectService = async (organizationId: string) => {
	const project = await prisma.project.findMany({
		where: {
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
