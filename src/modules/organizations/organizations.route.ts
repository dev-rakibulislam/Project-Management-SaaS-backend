import { Router } from "express";

import { organizationsController } from "./organizations.controller";

const router = Router();

router.post("/", organizationsController.createOrganizations);

router.get("/", organizationsController.getOrganizationss);

router.get("/:id", organizationsController.getOrganizations);

router.patch("/:id", organizationsController.updateOrganizations);

router.delete("/:id", organizationsController.deleteOrganizations);

export const organizationsRouter = router;
