import { Router } from "express";

import { teammembershipController } from "./teammembership.controller";

const router = Router();

router.post("/", teammembershipController.createTeammembership);

router.get("/", teammembershipController.getTeammemberships);

router.get("/:id", teammembershipController.getTeammembership);

router.patch("/:id", teammembershipController.updateTeammembership);

router.delete("/:id", teammembershipController.deleteTeammembership);

export const teammembershipRouter = router;
