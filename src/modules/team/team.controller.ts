import AppError from "../../error/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { getQueryParams } from "../../utils/query";
import { routeParam } from "../../utils/routeParam";
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
	const query = getQueryParams(req.query);

	const { meta, teams } = await teamService.getAllTeamService(
		organizationId,
		query,
	);
	return sendResponse(res, {
		code: 200,
		message: "Teams fetched successfully",
		data: teams,
		metaData:  meta,
	});
});

const getSingleTeamController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership!.organizationId;
	const teamId = routeParam(req, "teamId");

	const result = await teamService.getSingleTeamService(organizationId, teamId);

	return sendResponse(res, {
		code: 200,
		message: "Team fetched successfully",
		data: result,
	});
});

const updateTeamController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership!.organizationId;
	const teamId = routeParam(req, "teamId");

	const result = await teamService.updateTeamService(
		organizationId,
		teamId,
		req.body,
	);

	return sendResponse(res, {
		code: 200,
		message: "Team updated successfully",
		data: result,
	});
});

const deleteTeamController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership!.organizationId;
	const teamId = routeParam(req, "teamId");

	const result = await teamService.deleteTeamService(organizationId, teamId);

	return sendResponse(res, {
		code: 200,
		message: "Team deleted successfully",
		data: result,
	});
});

export const teamController = {
	createTeamController,
	getAllTeamController,
	getSingleTeamController,
	updateTeamController,
	deleteTeamController,
};
