import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { membershipService } from "./membership.service";

const addMemberController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership?.organizationId;

	const result = await membershipService.addMemberService(
		organizationId as string,
		req.body,
	);

	return sendResponse(res, {
		code: 201,
		message: "Member added successfully",
		data: result,
	});
});

const getMemberController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership?.organizationId;

	const result = await membershipService.getAllMembershipService(
		organizationId as string,
	);

	return sendResponse(res, {
		code: 200,
		message: "Members fetched successfully",
		data: result,
	});
});

export const membershipController = {
	addMemberController,
	getMemberController,
};
