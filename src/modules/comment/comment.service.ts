import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import type {
	CreateCommentInput,
	updateCommentValidationPayload,
} from "./comment.validation";

const createCommentService = async (
	organizationId: string,
	taskId: string,
	userId: string,
	data: CreateCommentInput,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	const comment = await prisma.comment.create({
		data: {
			content: data.content,
			taskId,
			userId,
		},
	});

	return comment;
};

const updateCommentService = async (
	commentId: string,
	taskId: string,
	userId: string,
	payload: updateCommentValidationPayload,
) => {
	const comment = await prisma.comment.findFirst({
		where: {
			id: commentId,
			taskId,
			userId,
			deletedAt: null,
		},
	});

	if (!comment) {
		throw new AppError(
			404,
			"Comment not found or you don't have permission to update it.",
		);
	}

	const updatedComment = await prisma.comment.update({
		where: {
			id: comment.id,
		},
		data: {
			content: payload.content,
		},
	});

	return updatedComment;
};

export const commentService = {
	createCommentService,
	updateCommentService,
};
