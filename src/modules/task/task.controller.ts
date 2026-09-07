import { Request, Response } from "express";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { taskService } from "./task.service";
import { catchAsync } from "../../utils/catchAsync";

const createTaskController = catchAsync(async (req: Request, res: Response) => {
	//
	const organizationId = req.organizationMembership!.organizationId;
	const userId = req.user!.id;
	const projectId = routeParam(req, "projectId");

	const result = await taskService.createTaskService(
		organizationId,
		projectId,
		userId,
		req.body,
	);

	return sendResponse(res, {
		code: 201,
		message: "Task created successfully.",
		data: result,
	});
});

const getTasksController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");

	const result = await taskService.getTasksService(projectId, organizationId);

	return sendResponse(res, {
		code: 200,
		message: "Tasks fetched successfully.",
		data: result,
	});
});

const updateTaskController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");
	const taskId = routeParam(req, "taskId");

	const result = await taskService.updateTaskService(
		taskId,
		projectId,
		organizationId,
		req.body,
	);

	return sendResponse(res, {
		code: 200,
		message: "Task updated successfully.",
		data: result,
	});
});

const assignTaskController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");
	const taskId = routeParam(req, "taskId");

	const result = await taskService.assignTaskService(
		taskId,
		projectId,
		organizationId,
		req.body,
	);

	return sendResponse(res, {
		code: 200,
		message: "Task assigned successfully.",
		data: result,
	});
});

const changeTaskStatusController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const userId = req.user!.id;

		const projectId = routeParam(req, "projectId");
		const taskId = routeParam(req, "taskId");

		const result = await taskService.changeTaskStatusService(
			taskId,
			projectId,
			organizationId,
			userId,
			req.body.status,
		);

		return sendResponse(res, {
			code: 200,
			message: "Task status changed successfully.",
			data: result,
		});
	},
);

const changeTaskPriorityController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const projectId = routeParam(req, "projectId");
		const taskId = routeParam(req, "taskId");

		const result = await taskService.changeTaskPriorityService(
			taskId,
			projectId,
			organizationId,
			req.body,
		);

		return sendResponse(res, {
			code: 200,
			message: "Task priority changed successfully.",
			data: result,
		});
	},
);

const deleteTaskController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");
	const taskId = routeParam(req, "taskId");

	const result = await taskService.deleteTaskService(
		taskId,
		projectId,
		organizationId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Task deleted successfully.",
		data: result,
	});
});

export const taskController = {
	createTaskController,
	getTasksController,
	updateTaskController,
	deleteTaskController,
	assignTaskController,
	changeTaskStatusController,
	changeTaskPriorityController,
};
