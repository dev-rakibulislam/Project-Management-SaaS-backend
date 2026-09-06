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
			req.body
		);

		return sendResponse(res, {
			code: 201,
			message: "Member added to team successfully.",
			data: result,
		});
	},
);

export const teamMembershipController = {
	addTeamMemberController,
	// getTeammemberships,
	// getTeammembership,
	// updateTeammembership,
	// deleteTeammembership,
};
