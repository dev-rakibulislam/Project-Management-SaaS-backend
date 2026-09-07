import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { projectService } from "./project.service";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";

const createProjectController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const userId = req.user.id;

		const result = await projectService.createProjectService(
			organizationId,
			userId,
			req.body,
		);

		return sendResponse(res, {
			code: 201,
			message: "Project created successfully.",
			data: result,
		});
	},
);

const assignProjectTeamController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const projectId = routeParam(req, "projectId");

		const result = await projectService.assignProjectTeamService(
			projectId,
			organizationId,
			req.body,
		);

		return sendResponse(res, {
			code: 200,
			message: "Team assigned to project successfully.",
			data: result,
		});
	},
);

const getProjectController = catchAsync(async (req: Request, res: Response) => {
	const organizationId = req.organizationMembership!.organizationId;

	const projectId = routeParam(req, "projectId");

	const result = await projectService.getProjectService(
		projectId,
		organizationId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Project fetched successfully.",
		data: result,
	});
});

const getAllProjectController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;


		const result = await projectService.getAllProjectService(
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Project fetched successfully.",
			data: result,
		});
	},
);

const updateProjectController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const projectId = routeParam(req, "projectId");

		const result = await projectService.updateProjectService(
			projectId,
			organizationId,
			req.body,
		);

		return sendResponse(res, {
			code: 200,
			message: "Project updated successfully.",
			data: result,
		});
	},
);

const deleteProjectController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const projectId = routeParam(req, "projectId");

		const result = await projectService.deleteProjectService(
			projectId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Project deleted successfully.",
			data: result,
		});
	},
);

export const projectController = {
	createProjectController,
	assignProjectTeamController,
	getAllProjectController,
	getProjectController,
	updateProjectController,
	deleteProjectController,
};
