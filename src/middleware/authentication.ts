import type { NextFunction, Request, Response } from "express";
import type { PlatformRole } from "../../generated/enums";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/http";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import AppError from "../error/appError";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const authMiddleware = (...requiredRoles: PlatformRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader?.startsWith("Bearer ")) {
			return sendResponse(res, {
				code: 401,
				message: "Unauthorized. Bearer token is required.",
			});
		}

		const token = authorizationHeader.split(" ")[1];

		if (!token) {
			return sendResponse(res, {
				code: 401,
				message: "Access token is missing.",
			});
		}

		const { success, data, error } = verifyToken(token, env.JWT_ACCESS_SECRET);

		if (!success) {
			throw new AppError(401, error || "Invalid or expired token.");
		}

		const { id, email, isActive } = data as JwtPayload;

		if (!id) {
			throw new AppError(401, "User ID missing from token.");
		}

		const authenticatedUser = await prisma.user.findUnique({
			where: {
				id,
				email,
			},
			select: {
				id: true,
				isActive: true,
				platformRole: true,
				email: true,
				deletedAt: true,
			},
		});

		if (!authenticatedUser) {
			throw new AppError(401, "Authentication failed. Please login again.");
		}

		if (authenticatedUser.deletedAt) {
			throw new AppError(403, "Your account is deleted.");
		}

		if (authenticatedUser.isActive !== isActive) {
			throw new AppError(403, "Your account is not active.");
		}

		if (
			requiredRoles.length > 0 &&
			!requiredRoles.includes(authenticatedUser.platformRole)
		) {
			throw new AppError(
				403,
				"Forbidden. You don't have permission to access this resource.",
			);
		}

		req.user = authenticatedUser;

		next();
	});
};

export default authMiddleware;
