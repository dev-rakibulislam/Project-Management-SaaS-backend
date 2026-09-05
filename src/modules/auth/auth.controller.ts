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

// const getMyProfileController = catchAsync(
// 	async (req: Request, res: Response) => {

// 		const data = await authService.getProfileFromDb(req.user);
// 		sendResponse(res, {
// 			code: 201,
// 			message: "User login successfully.",
// 			data,
// 		});
// 	},
// );

export const authController = {
	registerUserController,
	loginUserController,
	// getMyProfileController,
};
