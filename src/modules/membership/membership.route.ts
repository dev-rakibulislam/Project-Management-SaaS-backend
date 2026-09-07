// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { membershipController } from "./membership.controller";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import authMiddleware from "../../middleware/authentication";
import { validateData } from "../../middleware/validator.middleware";
import {
	createMembershipSchema,
	updateMemberShipRoleSchema,
	updateMemberShipStatusSchema,
} from "./membership.validation";

const router = Router();

router.post(
	"/:slug/invite",
	validateData(createMembershipSchema),
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.addMemberController,
);

router.get(
	"/:slug/members",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.getMemberController,
);

router.get(
	"/:slug/members/:memberId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.getSingleMemberController,
);

router.patch(
	"/:slug/members/:memberId/role",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(updateMemberShipRoleSchema),
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.updateMemberRoleController,
);

router.patch(
	"/:slug/members/:memberId/status",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(updateMemberShipStatusSchema),
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.updateMemberStatusController,
);

router.delete(
	"/:slug/members/:memberId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	membershipController.deleteMemberController,
);

export const membershipRouter = router;
