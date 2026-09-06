import { Router } from "express";
import { teamMembershipController } from "./teammembership.controller";
import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { validateData } from "../../middleware/validator.middleware";
import { addTeamMemberValidationSchema } from "./teammembership.validation";

const router = Router();

router.post(
	"/:slug/teams/:teamId/member",
	authMiddleware(PlatformRole.USER),
	validateData(addTeamMemberValidationSchema),
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	teamMembershipController.addTeamMemberController,
);

export const teamMembershipRouter = router;

// router.get("/", teammembershipController.getTeammemberships);
// router.get("/:id", teammembershipController.getTeammembership);
// router.patch("/:id", teammembershipController.updateTeammembership);
// router.delete("/:id", teammembershipController.deleteTeammembership);
