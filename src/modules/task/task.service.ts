import { MembershipStatus, OrganizationRole } from "../../../generated/enums";
import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type {
	assignTaskValidationPayload,
	changeTaskPriorityPayload,
	changeTaskStatusPayload,
	CreateTaskInput,
	updateTaskPayload,
} from "./task.validation";

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
			deletedAt: null,
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			title: true,
			description: true,
			status: true,
			priority: true,
		},
	});

	return tasks;
};

const updateTaskService = async (
	taskId: string,
	projectId: string,
	organizationId: string,
	payload: updateTaskPayload,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	if (payload.sprintId) {
		const sprint = await prisma.sprint.findFirst({
			where: {
				id: payload.sprintId,
				projectId,
			},
		});

		if (!sprint) {
			throw new AppError(404, "Sprint not found in this project.");
		}
	}

	const updatedTask = await prisma.task.update({
		where: {
			id: task.id,
		},
		data: {
			...(payload.title !== undefined && {
				title: payload.title,
			}),

			...(payload.description !== undefined && {
				description: payload.description,
			}),

			...(payload.sprintId !== undefined && {
				sprintId: payload.sprintId,
			}),

			...(payload.dueDate !== undefined && {
				dueDate: payload.dueDate,
			}),
		},
	});

	return updatedTask;
};

const changeTaskStatusService = async (
	taskId: string,
	projectId: string,
	organizationId: string,
	userId: string,
	status: changeTaskStatusPayload,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	const membership = await prisma.membership.findFirst({
		where: {
			userId,
			organizationId,
			status: MembershipStatus.ACTIVE,
			deleteAt: null,
		},
		select: {
			role: true,
		},
	});

	if (!membership) {
		throw new AppError(403, "You are not an active member.");
	}

	const isAdmin =
		membership.role === OrganizationRole.OWNER ||
		membership.role === OrganizationRole.ORG_ADMIN;

	const isAssignee = task.assigneeId === userId;

	if (!isAdmin && !isAssignee) {
		throw new AppError(
			403,
			"You don't have permission to change this task status.",
		);
	}

	const updatedTask = await prisma.task.update({
		where: {
			id: task.id,
		},
		data: {
			status: status.status,
		},
	});

	return updatedTask;
};

const assignTaskService = async (
	taskId: string,
	projectId: string,
	organizationId: string,
	assigneeId: assignTaskValidationPayload,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	const membership = await prisma.membership.findFirst({
		where: {
			userId: assigneeId.assigneeId,
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

	const updatedTask = await prisma.task.update({
		where: {
			id: task.id,
		},
		data: {
			assigneeId: assigneeId.assigneeId,
		},
	});

	return updatedTask;
};

const changeTaskPriorityService = async (
	taskId: string,
	projectId: string,
	organizationId: string,
	priority: changeTaskPriorityPayload,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}
	const updatedTask = await prisma.task.update({
		where: {
			id: task.id,
		},
		data: {
			priority: priority.priority,
		},
	});

	return updatedTask;
};

const deleteTaskService = async (
	taskId: string,
	projectId: string,
	organizationId: string,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			projectId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	await prisma.task.update({
		where: {
			id: task.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});

	return {};
};

export const taskService = {
	createTaskService,
	getTasksService,
	updateTaskService,
	deleteTaskService,
	assignTaskService,
	changeTaskStatusService,
	changeTaskPriorityService,
};
