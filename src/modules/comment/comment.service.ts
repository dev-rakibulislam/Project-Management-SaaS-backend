import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { QueryParams } from "../../types/query";
import { makeNoise } from "../../utils/makeNoise";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
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

	makeNoise({
		entityId: comment.id,
		action: "COMMENT_CREATED",
		entityType: "COMMENT",
		userId,
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

	makeNoise({
		entityId: updatedComment.id,
		action: "COMMENT_UPDATED",
		entityType: "COMMENT",
		userId,
	});

	return updatedComment;
};

const getAllCommentsService = async (
	taskId: string,
	organizationId: string,
	query: QueryParams,
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

	const { page, limit } = query;
	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "content"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		taskId,
		deletedAt: null,

		...(query.search && {
			content: {
				contains: query.search,
				mode: "insensitive" as const,
			},
		}),
	};

	const [comments, totalComments] = await prisma.$transaction([
		prisma.comment.findMany({
			where,
			skip,
			take: currentLimit,

			orderBy: {
				[sortBy]: query.sortOrder,
			},
			select: {
				id: true,
				content: true,
				task: {
					select: { title: true, description: true },
				},
				taskId: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		}),
		prisma.comment.count({ where }),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalComments),
		comments,
	};
};

const deleteCommentService = async (
	commentId: string,
	taskId: string,
	userId: string,
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
			"Comment not found or you don't have permission to delete it.",
		);
	}

	await prisma.comment.update({
		where: {
			id: comment.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});

	makeNoise({
		entityId: comment.id,
		action: "COMMENT_DELETED",
		entityType: "COMMENT",
		userId,
	});

	return {};
};

export const commentService = {
	createCommentService,
	updateCommentService,
	deleteCommentService,
	getAllCommentsService,
};
