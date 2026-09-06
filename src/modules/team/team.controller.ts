import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { teamService } from "./team.service";

const createTeamController = catchAsync(async (req, res) => {
	if (!req.organizationMembership) {
		return;
	}
	const organizationId = req.organizationMembership.id;
	const result = await teamService.createTeamService(organizationId, req.body);
	return sendResponse(res, {
		code: 201,
		message: "Team created successfully.",
		data: result,
	});
});

export const teamController = {
	createTeamController,
	// getTeams,
	// getTeam,
	// updateTeam,
	// deleteTeam,
};
