import { Router } from "express";

import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

import upload from "../../lib/multer";
import { attachmentController } from "./attachment.controller";

const router = Router();

router.post(
	"/:slug/projects/:projectId/tasks/:taskId/attachments",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
		OrganizationRole.MEMBER,
	),
	upload.single("file"),
	attachmentController.createAttachmentController,
);

// router.get("/", attachmentController.getAttachments);

// router.get("/:id", attachmentController.getAttachment);

// router.patch("/:id", attachmentController.updateAttachment);

// router.delete("/:id", attachmentController.deleteAttachment);

export const attachmentRouter = router;
