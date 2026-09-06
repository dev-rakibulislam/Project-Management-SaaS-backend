// biome-ignore assist/source/organizeImports: <explanation>
import type { Request, Response } from "express";

import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/http";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentStatus, SubscriptionStatus } from "../../../generated/enums";

const createPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const { message, paymentUrl, transactionId } =
			await paymentService.createPaymentService(req.body, req.user);

		sendResponse(res, {
			code: 201,
			message: message,
			data: { transactionId, paymentUrl },
		});
	},
);
const verifyPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const { tran_id, val_id } = req.body;
		const result = await paymentService.verifyPaymentService(tran_id, val_id);

		sendResponse(res, {
			code: 200,
			message: "Payment verified successfully",
			data: result,
		});
	},
);

const failPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const data = req.body;
	
		const result = await paymentService.failPaymentService(data);

		sendResponse(res, {
			code: 200,
			message: result.message || "Payment processing failed",
			data: {
				PaymentStatus: result.paymentStatus,
				...( "SubscriptionStatus" in result
					? { SubscriptionStatus: result.SubscriptionStatus }
					: {}),
			},
		});
	},
);

// const getSinglePaymentController = catchAsync(
// 	async (req: Request, res: Response) => {
// 		const payment = await paymentService.getSinglePaymentService(
// 			req.params.id as string,
// 		);

// 		sendResponse(res, {
// 			code: 200,
// 			message: payment.message,
// 			data: payment.data,
// 		});
// 	},
// );

// const getMyPaymentPaymentController = catchAsync(
// 	async (req: Request, res: Response) => {
// 		const payment = await paymentService.getMyPaymentService(req.user.id);

// 		sendResponse(res, {
// 			code: 200,
// 			message: payment.message,
// 			data: payment.data,
// 		});
// 	},
// );

export const paymentController = {
	createPaymentController,
	failPaymentController,
	verifyPaymentController,
	// getSinglePaymentController,
	// getMyPaymentPaymentController,
};
