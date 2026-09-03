import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async (req, res) => {
  // TODO
});

const getComments = catchAsync(async (req, res) => {
  // TODO
});

const getComment = catchAsync(async (req, res) => {
  // TODO
});

const updateComment = catchAsync(async (req, res) => {
  // TODO
});

const deleteComment = catchAsync(async (req, res) => {
  // TODO
});

export const commentController = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
