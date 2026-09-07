import { Router } from "express";

import { taskController } from "./task.controller";
import authMiddleware from "../../middleware/authentication";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import {
	assignTaskValidation,
	changeTaskPriorityValidation,
	changeTaskStatusValidation,
	createTaskValidation,
	updateTaskValidation,
} from "./task.validation";
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

router.patch(
	"/:slug/projects/:projectId/tasks/:taskId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(updateTaskValidation),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	taskController.updateTaskController,
);

router.patch(
	"/:slug/projects/:projectId/tasks/:taskId/assign",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(assignTaskValidation),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	taskController.assignTaskController,
);

router.patch(
	"/:slug/projects/:projectId/tasks/:taskId/status",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(changeTaskStatusValidation),
	organizationAccessMiddleware(),
	taskController.changeTaskStatusController,
);

router.patch(
	"/:slug/projects/:projectId/tasks/:taskId/priority",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	validateData(changeTaskPriorityValidation),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	taskController.changeTaskPriorityController,
);

router.delete(
	"/:slug/projects/:projectId/tasks/:taskId",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	taskController.deleteTaskController,
);

export const taskRouter = router;
