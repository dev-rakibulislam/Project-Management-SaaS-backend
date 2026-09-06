import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { attachmentService } from "./attachment.service";
import AppError from "../../error/appError";

const createAttachmentController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;
		const userId = req.user!.id;
		const taskId = routeParam(req, "taskId");
		const file = req.file;
		const filename = req.file?.originalname;
		if (!file) {
			throw new AppError(400, "File is required.");
		}

		const result = await attachmentService.createAttachmentService(
			organizationId,
			taskId,
			userId,
			file.buffer,
			filename as string,
		);

		return sendResponse(res, {
			code: 201,
			message: "Attachment uploaded successfully.",
			data: result,
		});
	},
);

export const attachmentController = {
	createAttachmentController,
	// getAttachments,
	// getAttachment,
	// updateAttachment,
	// deleteAttachment,
};
