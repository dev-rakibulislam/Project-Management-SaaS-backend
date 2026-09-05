import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { ZodError } from "zod";
import handleZodError from "./handleZodError";
import { sendResponse } from "../utils/http";
import AppError from "./appError";
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from "../../generated/internal/prismaNamespace";
import { handlePrismaError } from "./handlePrismaError";

const globalErrorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	env.NODE_ENV === "development" && console.error(error);

	if (error.type === "entity.parse.failed") {
		return sendResponse(res, {
			code: error.statusCode,
			message: error.message,
			errorDetails: error,
		});
	}

	if (error instanceof ZodError) {
		const { statusCode, errors, message } = handleZodError(error);
		return sendResponse(res, {
			code: statusCode,
			message,
			errorDetails: errors,
		});
	}

	if (error instanceof AppError) {
		return sendResponse(res, {
			code: error.statusCode,
			message: error.message,
			errorDetails: error,
		});
	}

	if (error instanceof PrismaClientKnownRequestError) {
		const simplifiedError = handlePrismaError(error);

		return sendResponse(res, {
			code: simplifiedError.statusCode,
			message: simplifiedError.message,
			errorDetails: simplifiedError.errors,
		});
	}

	if (error instanceof PrismaClientValidationError) {
		return sendResponse(res, {
			code: 400,
			message: "Database validation error",
			errorDetails: [
				{
					path: "database",
					message: error.message,
				},
			],
		});
	}
};

export default globalErrorHandler;
