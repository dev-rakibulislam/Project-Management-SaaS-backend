import { Router } from "express";
import { sprintController } from "./sprint.controller";
import authMiddleware from "../../middleware/authentication";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import { createSprintValidation } from "./sprint.validation";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

const router = Router();

router.post(
	"/:slug/projects/:projectId/sprints",
	authMiddleware(PlatformRole.USER),
	validateData(createSprintValidation),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	sprintController.createSprintController,
);

router.get(
	"/:slug/projects/:projectId/sprints",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.MEMBER,
	),
	sprintController.getSprintsController,
);

router.get(
	"/:slug/projects/:projectId/sprints/:sprintId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,

	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.MEMBER,
	),
	sprintController.getSprintController,
);

router.patch(
	"/:slug/projects/:projectId/sprints/:sprintId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(createSprintValidation),

	organizationAccessMiddleware(
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.OWNER,
	),
	sprintController.updateSprintController,
);

export const sprintRouter = router;
