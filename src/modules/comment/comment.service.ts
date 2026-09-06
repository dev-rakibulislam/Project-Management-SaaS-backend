import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { CreateCommentInput } from "./comment.validation";


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



export const commentService = {
  createCommentService,
};
