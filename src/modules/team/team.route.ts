// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { teamController } from "./team.controller";
import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { validateData } from "../../middleware/validator.middleware";
import { createTeamValidationSchema } from "./team.validation";

const router = Router();

router.post(
	"/:slug/teams",
	authMiddleware(PlatformRole.USER),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	validateData(createTeamValidationSchema),
	teamController.createTeamController,
);

// router.get("/", teamController.getTeams);
// router.get("/:id", teamController.getTeam);
// router.patch("/:id", teamController.updateTeam);
// router.delete("/:id", teamController.deleteTeam);

export const teamRouter = router;
