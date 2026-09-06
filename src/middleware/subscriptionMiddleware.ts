import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import AppError from "../error/appError";
import { OrganizationStatus } from "../../generated/enums";

const subscriptionMiddleware = catchAsync(
	async (req: Request, _res: Response, next: NextFunction) => {
		const organizationId = req.params.id as string;

		const subscription = await prisma.subscription.findFirst({
			where: {
				organizationId,
				status: OrganizationStatus.ACTIVE,
			},
		});

		if (!subscription) {
			throw new AppError(
				403,
				"Active subscription is required to access this resource.",
			);
		}

		next();
	},
);

export default subscriptionMiddleware;
