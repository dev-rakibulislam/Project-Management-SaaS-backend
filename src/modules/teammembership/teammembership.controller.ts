import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { teammembershipService } from "./teammembership.service";

const addTeamMemberController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;
		const teamId = routeParam(req, "teamId");

		const result = await teammembershipService.addTeamMemberService(
			teamId,
			organizationId,
			req.body,
		);

		return sendResponse(res, {
			code: 201,
			message: "Member added to team successfully.",
			data: result,
		});
	},
);

const getAllTeamMembersController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const teamId = routeParam(req, "teamId");

		const result = await teammembershipService.getAllTeamMembersService(
			teamId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Team members fetched successfully.",
			data: result,
		});
	},
);

const getSingleTeamMemberController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const teamId = routeParam(req, "teamId");
		const teamMemberId = routeParam(req, "teamMemberId");

		const result = await teammembershipService.getSingleTeamMemberService(
			teamId,
			teamMemberId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Team member fetched successfully.",
			data: result,
		});
	},
);

const deleteTeamMemberController = catchAsync(
	async (req: Request, res: Response) => {
		const organizationId = req.organizationMembership!.organizationId;

		const teamId = routeParam(req, "teamId");
		const teamMemberId = routeParam(req, "teamMemberId");

		const result = await teammembershipService.deleteTeamMemberService(
			teamId,
			teamMemberId,
			organizationId,
		);

		return sendResponse(res, {
			code: 200,
			message: "Team member removed successfully.",
			data: result,
		});
	},
);

export const teamMembershipController = {
	addTeamMemberController,
	getAllTeamMembersController,
	getSingleTeamMemberController,
	deleteTeamMemberController,
};
