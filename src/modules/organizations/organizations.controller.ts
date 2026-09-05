import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/http";
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

export const organizationsController = {
	createOrganizationController,
};
