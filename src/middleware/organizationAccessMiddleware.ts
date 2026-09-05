import type { NextFunction, Request, Response } from "express";

import { MembershipStatus, type OrganizationRole } from "../../generated/enums";

import { catchAsync } from "../utils/catchAsync";
import AppError from "../error/appError";
import { prisma } from "../lib/prisma";
import { routeParam } from "../utils/routeParam";

const organizationAccessMiddleware = (...requiredRoles: OrganizationRole[]) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			const organizationId = routeParam(req, "id");

			if (!organizationId) {
				throw new AppError(400, "Organization ID is required.");
			}

			if (!req.user) {
				throw new AppError(401, "Unauthorized.");
			}

			const membership = await prisma.membership.findUnique({
				where: {
					userId_organizationId: {
						userId: req.user.id,
						organizationId,
					},
				},
				select: {
					id: true,
					userId: true,
					organizationId: true,
					role: true,
					status: true,
					deleteAt: true,
				},
			});

			if (!membership) {
				throw new AppError(403, "You are not a member of this organization.");
			}

			if (membership.deleteAt) {
				throw new AppError(403, "Your membership is deleted.");
			}

			if (membership.status !== MembershipStatus.ACTIVE) {
				throw new AppError(403, "Your membership is not active.");
			}

			if (
				requiredRoles.length > 0 &&
				!requiredRoles.includes(membership.role)
			) {
				throw new AppError(
					403,
					"Forbidden. You don't have permission to access this resource.",
				);
			}

			req.organizationMembership = membership;

			next();
		},
	);
};

export default organizationAccessMiddleware;
