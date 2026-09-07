// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { membershipController } from "./membership.controller";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import authMiddleware from "../../middleware/authentication";
import { validateData } from "../../middleware/validator.middleware";
import { createMembershipSchema } from "./membership.validation";

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

router.get("/:slug/members", membershipController.getMemberController);

// router.get("/:id", membershipController.getMembership);

// router.patch("/:id", membershipController.updateMembership);

// router.delete("/:id", membershipController.deleteMembership);

export const membershipRouter = router;
