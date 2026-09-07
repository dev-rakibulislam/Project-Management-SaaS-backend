import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { routeParam } from "../../utils/routeParam";
import { organizationsService } from "./organizations.service";

const createOrganizationController = catchAsync(async (req, res) => {
	const result = await organizationsService.createOrganizationService(
		req.body,
		req.user,
	);
	sendResponse(res, {
		code: 201,
		message: "Organization created successfully",
		data: result,
	});
});

const getMyOrganizationController = catchAsync(async (req, res) => {
	const result = await organizationsService.getMyOrganizationService(req.user);
	sendResponse(res, {
		code: 200,
		message: "Organization retrieved successfully",
		data: result,
	});
});

const getMySingleOrganizationController = catchAsync(async (req, res) => {
	const organization =
		await organizationsService.getMySingleOrganizationService(
			req.params.id as string,
		);
	sendResponse(res, {
		code: 200,
		message: "Organization fetched successfully",
		data: organization
			? (() => {
					const { _count, ...rest } = organization;
					return { ...rest, memberCount: _count.memberships ?? 0 };
				})()
			: null,
	});
});

const getSingleOrganizationMemberController = catchAsync(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const orgId = routeParam(req, "orgId");
	const organization =
		await organizationsService.getSingleOrganizationMemberService(
			orgId,
			page,
			limit,
		);
	sendResponse(res, {
		code: 200,
		message: "Organization fetched successfully",
		data: organization,
	});
});

const updateOrganizationController = catchAsync(async (req, res) => {
	const orgId = routeParam(req, "orgId");
	const organization =
		await organizationsService.updateOrganizationService(orgId,req.body);
	sendResponse(res, {
		code: 200,
		message: "Organization updated successfully",
		data: organization,
	});
});

export const organizationsController = {
	createOrganizationController,
	getMyOrganizationController,
	getMySingleOrganizationController,
	getSingleOrganizationMemberController,
	updateOrganizationController,
};
