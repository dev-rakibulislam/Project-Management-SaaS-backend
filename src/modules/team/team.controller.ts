import AppError from "../../error/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { teamService } from "./team.service";

const createTeamController = catchAsync(async (req, res) => {
	if (!req.organizationMembership) {
		return;
	}
	const organizationId = req.organizationMembership.organizationId;

	const result = await teamService.createTeamService(organizationId, req.body);
	return sendResponse(res, {
		code: 201,
		message: "Team created successfully.",
		data: result,
	});
});

const getAllTeamController = catchAsync(async (req, res) => {
	if (!req.organizationMembership) {
		throw new AppError(401, "Unauthorized access");
	}

	const organizationId = req.organizationMembership.organizationId;

	const result = await teamService.getAllTeamService(organizationId);
	return sendResponse(res, {
		code: 200,
		message: "Teams fetched successfully",
		data: result,
	});
});

export const teamController = {
	createTeamController,
	getAllTeamController,
	// getTeam,
	// updateTeam,
	// deleteTeam,
};
