import { catchAsync } from "../../utils/catchAsync";

const createSubtask = catchAsync(async (req, res) => {
  // TODO
});

const getSubtasks = catchAsync(async (req, res) => {
  // TODO
});

const getSubtask = catchAsync(async (req, res) => {
  // TODO
});

const updateSubtask = catchAsync(async (req, res) => {
  // TODO
});

const deleteSubtask = catchAsync(async (req, res) => {
  // TODO
});

export const subtaskController = {
  createSubtask,
  getSubtasks,
  getSubtask,
  updateSubtask,
  deleteSubtask,
};
