import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { sprintService } from "./sprint.service";

const createSprintController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;
		const userId = req.user!.id;
		const projectId = routeParam(req, "projectId");

		const result = await sprintService.createSprintService(
			organizationId,
			userId,
      projectId,
			req.body,
		);

		return sendResponse(res, {
			code: 201,
			message: "Sprint created successfully.",
			data: result,
		});
	},
);

const getSprintsController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");

	const result = await sprintService.getSprintsService(
		organizationId,
		projectId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Sprints retrieved successfully.",
		data: result,
	});
});

const getSprintController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");
	const sprintId = routeParam(req, "sprintId");

	const result = await sprintService.getSprintService(
		organizationId,
		projectId,
		sprintId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Sprint retrieved successfully.",
		data: result,
	});
});

export const sprintController = {
	createSprintController,
	getSprintsController,
	getSprintController,
};
