import { Router } from "express";

import { teamController } from "./team.controller";

const router = Router();

router.post("/", teamController.createTeam);

router.get("/", teamController.getTeams);

router.get("/:id", teamController.getTeam);

router.patch("/:id", teamController.updateTeam);

router.delete("/:id", teamController.deleteTeam);

export const teamRouter = router;
