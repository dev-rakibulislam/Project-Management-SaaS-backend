import { Router } from "express";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import authMiddleware from "../../middleware/authentication";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

import { projectController } from "./project.controller";
import { validateData } from "../../middleware/validator.middleware";
import { assignProjectTeamValidation, createProjectValidationSchema } from "./project.validation";

const router = Router();

router.post(
	"/:slug/projects",
	authMiddleware(PlatformRole.USER),
	validateData(createProjectValidationSchema),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	projectController.createProjectController,
);

router.patch(
	"/:slug/projects/:projectId/team",
	authMiddleware(PlatformRole.USER),
	validateData(assignProjectTeamValidation),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	projectController.assignProjectTeamController,
);
// router.get("/", projectController.getProjects);

// router.get("/:id", projectController.getProject);

// router.delete("/:id", projectController.deleteProject);

export const projectRouter = router;
