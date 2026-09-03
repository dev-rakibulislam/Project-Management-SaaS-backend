import { Router } from "express";

import { membershipController } from "./membership.controller";

const router = Router();

router.post("/", membershipController.createMembership);

router.get("/", membershipController.getMemberships);

router.get("/:id", membershipController.getMembership);

router.patch("/:id", membershipController.updateMembership);

router.delete("/:id", membershipController.deleteMembership);

export const membershipRouter = router;
