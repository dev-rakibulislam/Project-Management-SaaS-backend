import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { getQueryParams } from "../../utils/query";
import { routeParam } from "../../utils/routeParam";
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
	const query = getQueryParams(req.query);

	const { memberships, meta } = await membershipService.getAllMembershipService(
		organizationId as string,
		query,
	);

	return sendResponse(res, {
		code: 200,
		message: "Members fetched successfully",
		data: memberships,
		metaData: meta,
	});
});

const getSingleMemberController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership?.organizationId;
	const memberId = routeParam(req, "memberId");
	const result = await membershipService.getSingleMembershipService(
		organizationId as string,
		memberId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Members fetched successfully",
		data: result,
	});
});

const updateMemberRoleController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership?.organizationId;
	const memberId = routeParam(req, "memberId");
	const result = await membershipService.updateMembershipRoleService(
		organizationId as string,
		memberId,
		req.body,
	);

	return sendResponse(res, {
		code: 200,
		message: "Members fetched successfully",
		data: result,
	});
});

const updateMemberStatusController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership!.organizationId;
	const memberId = routeParam(req, "memberId");

	const result = await membershipService.updateMemberStatusService(
		organizationId,
		memberId,
		req.body,
	);

	return sendResponse(res, {
		code: 200,
		message: "Member status updated successfully",
		data: result,
	});
});

const deleteMemberController = catchAsync(async (req, res) => {
	const organizationId = req.organizationMembership!.organizationId;
	const memberId = routeParam(req, "memberId");

	const result = await membershipService.deleteMemberService(
		organizationId,
		memberId,
	);

	return sendResponse(res, {
		code: 200,
		message: "Member deleted successfully",
		data: result,
	});
});
export const membershipController = {
	addMemberController,
	getMemberController,
	getSingleMemberController,
	updateMemberRoleController,
	updateMemberStatusController,
	deleteMemberController,
};
