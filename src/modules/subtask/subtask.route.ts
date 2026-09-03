import { Router } from "express";

import { subtaskController } from "./subtask.controller";

const router = Router();

router.post("/", subtaskController.createSubtask);

router.get("/", subtaskController.getSubtasks);

router.get("/:id", subtaskController.getSubtask);

router.patch("/:id", subtaskController.updateSubtask);

router.delete("/:id", subtaskController.deleteSubtask);

export const subtaskRouter = router;
