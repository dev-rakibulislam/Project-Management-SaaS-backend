import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import { createOrganizationsSchema } from "./organizations.validation";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";

const router = Router();

router.post(
	"/",
	authMiddleware(PlatformRole.USER),
	validateData(createOrganizationsSchema),
	organizationsController.createOrganizationController,
);

router.get(
	"/",
	authMiddleware(PlatformRole.USER),
	organizationsController.getMyOrganizationController,
);

router.get(
	"/:id",
	authMiddleware(PlatformRole.USER),
	organizationsController.getMySingleOrganizationController,
);

router.get(
	"/:id/members",
	authMiddleware(PlatformRole.USER),
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	organizationsController.getSingleOrganizationMemberController,
);

router.patch(
	"/:id",
	authMiddleware(PlatformRole.USER),
	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	organizationsController.updateOrganizationController,
);

export const organizationsRouter = router;
