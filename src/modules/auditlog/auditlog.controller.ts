import { catchAsync } from "../../utils/catchAsync";

const createAuditlog = catchAsync(async (req, res) => {
  // TODO
});

const getAuditlogs = catchAsync(async (req, res) => {
  // TODO
});

const getAuditlog = catchAsync(async (req, res) => {
  // TODO
});

const updateAuditlog = catchAsync(async (req, res) => {
  // TODO
});

const deleteAuditlog = catchAsync(async (req, res) => {
  // TODO
});

export const auditlogController = {
  createAuditlog,
  getAuditlogs,
  getAuditlog,
  updateAuditlog,
  deleteAuditlog,
};
