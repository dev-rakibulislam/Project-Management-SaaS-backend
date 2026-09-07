import { MembershipStatus } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type { CreateTaskInput } from "./task.validation";

const createTaskService = async (
	organizationId: string,
	projectId: string,
	userId: string,
	data: CreateTaskInput,
) => {
	// Check project
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

	// Check sprint
	if (data.sprintId) {
		const sprint = await prisma.sprint.findFirst({
			where: {
				id: data.sprintId,
				projectId,
			},
		});

		if (!sprint) {
			throw new AppError(404, "Sprint not found in this project.");
		}
	}

	// Check assignee
	if (data.assigneeId) {
		const membership = await prisma.membership.findFirst({
			where: {
				userId: data.assigneeId,
				organizationId,
				status: MembershipStatus.ACTIVE,
				deleteAt: null,
			},
		});

		if (!membership) {
			throw new AppError(
				404,
				"Assignee is not an active member of this organization.",
			);
		}
	}

	const task = await prisma.task.create({
		data: {
			title: data.title,
			description: data.description,
			organizationId,
			projectId,
			sprintId: data.sprintId,
			assigneeId: data.assigneeId,
			createdById: userId,
			status: data.status,
			priority: data.priority,
			dueDate: data.dueDate,
		},
	});

	return task;
};

const getTasksService = async (projectId: string, organizationId: string) => {
	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			organizationId,
		},
	});

	if (!project) {
		throw new AppError(404, "Project not found.");
	}

	const tasks = await prisma.task.findMany({
		where: {
			projectId,
			organizationId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return tasks;
};

export const taskService = {
	createTaskService,
	getTasksService,
};
