// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { teamController } from "./team.controller";
import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { validateData } from "../../middleware/validator.middleware";
import {
	createTeamValidationSchema,
	updateTeamSchema,
} from "./team.validation";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

const router = Router();

router.post(
	"/:slug/teams",
	authMiddleware(PlatformRole.USER),
	validateData(createTeamValidationSchema),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	teamController.createTeamController,
);

router.get(
	"/:slug/teams",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	teamController.getAllTeamController,
);
router.get(
	"/:slug/teams/:teamId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(),
	teamController.getSingleTeamController,
);

router.patch(
	"/:slug/teams/:teamId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(updateTeamSchema),
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	teamController.updateTeamController,
);

router.delete(
	"/:slug/teams/:teamId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	teamController.deleteTeamController,
);

export const teamRouter = router;
