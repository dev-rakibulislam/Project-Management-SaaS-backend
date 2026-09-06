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

export const commentController = {
	createCommentController,
};
