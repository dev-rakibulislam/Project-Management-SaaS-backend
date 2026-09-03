import { Router } from "express";

import { taskController } from "./task.controller";

const router = Router();

router.post("/", taskController.createTask);

router.get("/", taskController.getTasks);

router.get("/:id", taskController.getTask);

router.patch("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export const taskRouter = router;
