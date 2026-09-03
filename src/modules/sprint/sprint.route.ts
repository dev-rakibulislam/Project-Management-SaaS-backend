import { Router } from "express";

import { sprintController } from "./sprint.controller";

const router = Router();

router.post("/", sprintController.createSprint);

router.get("/", sprintController.getSprints);

router.get("/:id", sprintController.getSprint);

router.patch("/:id", sprintController.updateSprint);

router.delete("/:id", sprintController.deleteSprint);

export const sprintRouter = router;
