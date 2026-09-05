import type { Response } from "express";
import { env } from "../config/env";

export interface ISendResponseParams {
	code: number;
	message: string;
	data?: any;
	metaData?: any;
	errorDetails?: any;
}

export const sendResponse = (
	res: Response,
	{ code, message, data, metaData, errorDetails }: ISendResponseParams,
) => {
	return res.status(code).json({
		success: code >= 200 && code < 300,
		message,
		data,
		metaData,
		errorDetails: env.NODE_ENV === "development" && errorDetails,
	});
};
