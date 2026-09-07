import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
import { authService } from "./auth.service";

const registerUserController = catchAsync(async (req, res) => {
	const { accessToken, refreshToken } = await authService.registerUserInDb(
		req.body,
	);

	sendResponse(res, {
		code: 200,
		message: "User created successfully.",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const loginUserController = catchAsync(async (req, res) => {
	const { accessToken, refreshToken } = await authService.loginUser(req.body);

	sendResponse(res, {
		code: 200,
		message: "User login successfully.",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.id;

	const result = await authService.getMyProfileService(userId);

	sendResponse(res, {
		code: 200,
		message: "Profile retrieved successfully.",
		data: result,
	});
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const { credential } = req.body;

	const result = await authService.googleLoginService(credential);

	sendResponse(res, {
		code: 200,
		message: "Google login successful.",
		data: result,
	});
});

export const authController = {
	registerUserController,
	loginUserController,
	getMyProfile,
	googleLogin,
};
