import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { assignProjectTeamValidationPayload, createProjectValidationPayload } from "./project.validation";

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

const getProject = async () => {
	// TODO
};

const updateProject = async () => {
	// TODO
};

const deleteProject = async () => {
	// TODO
};

export const projectService = {
	createProjectService,
	assignProjectTeamService,
	getProject,
	updateProject,
	deleteProject,
};
