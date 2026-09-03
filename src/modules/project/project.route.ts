import { Router } from "express";

import { projectController } from "./project.controller";

const router = Router();

router.post("/", projectController.createProject);

router.get("/", projectController.getProjects);

router.get("/:id", projectController.getProject);

router.patch("/:id", projectController.updateProject);

router.delete("/:id", projectController.deleteProject);

export const projectRouter = router;
