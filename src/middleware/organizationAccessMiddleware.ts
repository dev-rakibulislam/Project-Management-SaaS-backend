import { NextFunction, Request, Response } from "express";
import { MembershipStatus, OrganizationRole } from "../../generated/enums";
import AppError from "../error/appError";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { routeParam } from "../utils/routeParam";

const organizationAccessMiddleware = (...requiredRoles: OrganizationRole[]) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			const slug = routeParam(req, "slug");

			if (!slug) {
				throw new AppError(400, "Organization slug is required.");
			}

			if (!req.user) {
				throw new AppError(401, "Unauthorized.");
			}

			// 1. Organization check
			const organization = await prisma.organization.findUnique({
				where: {
					slug,
				},
				select: {
					id: true,
					name: true,
					slug: true,
					deletedAt: true,
				},
			});


			if (!organization || organization.deletedAt) {
				throw new AppError(404, "Organization not found.");
			}

			const membership = await prisma.membership.findUnique({
				where: {
					userId_organizationId: {
						userId: req.user.id,
						organizationId: organization.id,
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
					"You don't have permission to access this resource.",
				);
			}

			req.organizationMembership = membership;

			next();
		},
	);
};

export default organizationAccessMiddleware;
