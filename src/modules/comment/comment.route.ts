import { Router } from "express";

import { commentController } from "./comment.controller";

const router = Router();

router.post("/", commentController.createComment);

router.get("/", commentController.getComments);

router.get("/:id", commentController.getComment);

router.patch("/:id", commentController.updateComment);

router.delete("/:id", commentController.deleteComment);

export const commentRouter = router;
