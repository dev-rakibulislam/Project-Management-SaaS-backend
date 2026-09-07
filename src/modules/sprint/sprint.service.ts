import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { makeNoise } from "../../utils/makeNoise";
import type {
	CreateSprintInputPayload,
	updateSprintValidationPayload,
} from "./sprint.validation";

const createSprintService = async (
	organizationId: string,
	userId: string,
	projectId: string,
	data: CreateSprintInputPayload,
) => {
	// Check project belongs to organization
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found in this organization.");
	}

	const sprint = await prisma.sprint.create({
		data: {
			name: data.name,
			goal: data.goal,
			projectId,
			status: data.status,
			startDate: data.startDate,
			endDate: data.endDate,
			createdById: userId,
		},
	});

	await makeNoise({
		action: "SPRINT_CREATED",
		entityId: sprint.id,
		entityType: "SPRINT",
		userId,
		organizationId,
		metadata: { name: sprint.name },
	});

	return sprint;
};

const getSprintsService = async (organizationId: string, projectId: string) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found in this organization.");
	}

	return prisma.sprint.findMany({
		where: {
			projectId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getSprintService = async (
	organizationId: string,
	projectId: string,
	sprintId: string,
) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			projectId,
			project: {
				organizationId,
				deletedAt: null,
			},
		},
	});

	if (!sprint) {
		throw new AppError(404, "Sprint not found.");
	}

	return sprint;
};

const updateSprintService = async (
	sprintId: string,
	organizationId: string,
	payload: updateSprintValidationPayload,
) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				organizationId,
			},
		},
	});

	if (!sprint) {
		throw new AppError(404, "Sprint not found.");
	}

	const updatedSprint = await prisma.sprint.update({
		where: {
			id: sprint.id,
		},
		data: payload,
	});

	return updatedSprint;
};

const deleteSprintService = async (
	sprintId: string,
	organizationId: string,
) => {
	const sprint = await prisma.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				organizationId,
			},
		},
	});

	if (!sprint) {
		throw new AppError(404, "Sprint not found.");
	}

	await prisma.sprint.delete({
		where: {
			id: sprint.id,
		},
	});

	await makeNoise({
		action: "SPRINT_DELETED",
		entityId: sprint.id,
		entityType: "SPRINT",
		organizationId,
	});

	return {};
};

export const sprintService = {
	createSprintService,
	getSprintsService,
	getSprintService,
	updateSprintService,
	deleteSprintService,
};
