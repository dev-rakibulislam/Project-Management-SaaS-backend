import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getQueryParams } from "../../utils/query";
import { sendResponse } from "../../utils/http";
import { superAdminService } from "./superadmin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const query = getQueryParams(req.query as Record<string, unknown>);

	const { meta, users } = await superAdminService.getAllUsersService(query);

	sendResponse(res, {
		code: 200,
		message: "Users retrieved successfully.",
		data: users,
		metaData: meta,
	});
});

const getAllOrganizations = catchAsync(async (req: Request, res: Response) => {
	const query = getQueryParams(req.query as Record<string, unknown>);

	const { meta, organizations } =
		await superAdminService.getAllOrganizationsService(query);

	sendResponse(res, {
		code: 200,
		message: "Organizations retrieved successfully.",
		data: organizations,
		metaData: meta,
	});
});

const getPlatformStatistics = catchAsync(
	async (req: Request, res: Response) => {
		const result = await superAdminService.getPlatformStatisticsService();

		sendResponse(res, {
			code: 200,
			message: "Platform statistics retrieved successfully.",
			data: result,
		});
	},
);

const suspendUser = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params;
	const result = await superAdminService.suspendUserService(userId as string);

	sendResponse(res, {
		code: 200,
		message: "User suspended successfully.",
		data: result,
	});
});

const restoreUser = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params;

	const result = await superAdminService.restoreUserService(userId as string);

	sendResponse(res, {
		code: 200,
		message: "User restored successfully.",
		data: result,
	});
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
	const query = getQueryParams(req.query as Record<string, unknown>);

	const { meta, payments } =
		await superAdminService.getAllPaymentsService(query);

	sendResponse(res, {
		code: 200,
		message: "Payments retrieved successfully.",
		data: payments,
		metaData: meta,
	});
});

export const superAdminController = {
	getAllUsers,
	getAllOrganizations,
	getPlatformStatistics,
	suspendUser,
	restoreUser,
	getAllPayments,
};
