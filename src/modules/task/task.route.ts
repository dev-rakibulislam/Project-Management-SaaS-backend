import { Router } from "express";

import { taskController } from "./task.controller";
import authMiddleware from "../../middleware/authentication";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import { createTaskValidation } from "./task.validation";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

const router = Router();

router.post(
	"/:slug/projects/:projectId/tasks",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(createTaskValidation),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	taskController.createTaskController,
);

router.get(
	"/:slug/projects/:projectId/tasks",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(),
	taskController.getTasksController,
);

export const taskRouter = router;
