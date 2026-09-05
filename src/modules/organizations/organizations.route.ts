import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import authMiddleware from "../../middleware/authentication";
import { PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import { createOrganizationsSchema } from "./organizations.validation";

const router = Router();

router.post(
	"/create",
	authMiddleware(PlatformRole.USER),
  validateData(createOrganizationsSchema),
	organizationsController.createOrganizationController,
);


router.get(
	"/my-organization",
	authMiddleware(PlatformRole.USER),
	organizationsController.getMyOrganizationController,
);



export const organizationsRouter = router;
