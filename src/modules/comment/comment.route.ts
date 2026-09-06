import { Router } from "express";

import { commentController } from "./comment.controller";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import authMiddleware from "../../middleware/authentication";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";
import { validateData } from "../../middleware/validator.middleware";
import { createCommentValidation } from "./comment.validation";

const router = Router();

router.post(
	"/:slug/projects/:projectId/tasks/:taskId/comments",
	authMiddleware(PlatformRole.USER),
	validateData(createCommentValidation),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.MEMBER,
	),
	commentController.createCommentController,
);
export const commentRouter = router;
