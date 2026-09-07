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

const getTasksController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId =
			req.organizationMembership!.organizationId;

		const projectId = routeParam(req, "projectId");

		const result = await taskService.getTasksService(
			projectId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Tasks fetched successfully.",
			data: result,
		});
	},
);

export const taskController = {
	createTaskController,getTasksController
};
