import { Router } from "express";

import { attachmentController } from "./attachment.controller";

const router = Router();

router.post("/", attachmentController.createAttachment);

router.get("/", attachmentController.getAttachments);

router.get("/:id", attachmentController.getAttachment);

router.patch("/:id", attachmentController.updateAttachment);

router.delete("/:id", attachmentController.deleteAttachment);

export const attachmentRouter = router;
