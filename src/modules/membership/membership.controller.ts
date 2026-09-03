import { catchAsync } from "../../utils/catchAsync";

const createMembership = catchAsync(async (req, res) => {
  // TODO
});

const getMemberships = catchAsync(async (req, res) => {
  // TODO
});

const getMembership = catchAsync(async (req, res) => {
  // TODO
});

const updateMembership = catchAsync(async (req, res) => {
  // TODO
});

const deleteMembership = catchAsync(async (req, res) => {
  // TODO
});

export const membershipController = {
  createMembership,
  getMemberships,
  getMembership,
  updateMembership,
  deleteMembership,
};
