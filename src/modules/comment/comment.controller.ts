import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { commentService } from "./comment.service";

export const createCommentController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;
		const userId = req.user!.id;
		const taskId = routeParam(req, "taskId");

		const result = await commentService.createCommentService(
			organizationId,
			taskId,
			userId,
			req.body,
		);

		return sendResponse(res, {
			code: 201,
			message: "Comment created successfully.",
			data: result,
		});
	},
);

const updateCommentController = catchAsync(
	async (req: Request, res: Response) => {
		const commentId = routeParam(req, "commentId");
		const taskId = routeParam(req, "taskId");
		const userId = req.user!.id;

		const result = await commentService.updateCommentService(
			commentId,
			taskId,
			userId,
			req.body,
		);

		return sendResponse(res, {
			code: 200,
			message: "Comment updated successfully.",
			data: result,
		});
	},
);

const getAllCommentsController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const taskId = routeParam(req, "taskId");

		const result = await commentService.getAllCommentsService(
			taskId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Comments fetched successfully.",
			data: result,
		});
	},
);

const deleteCommentController = catchAsync(
	async (req: Request, res: Response) => {
		const commentId = routeParam(req, "commentId");
		const taskId = routeParam(req, "taskId");
		const userId = req.user!.id;

		const result = await commentService.deleteCommentService(
			commentId,
			taskId,
			userId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Comment deleted successfully.",
			data: result,
		});
	},
);

export const commentController = {
	createCommentController,
	updateCommentController,
	deleteCommentController,
	getAllCommentsController,
};
