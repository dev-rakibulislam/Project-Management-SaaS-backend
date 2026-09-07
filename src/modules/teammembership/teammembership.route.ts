import { Router } from "express";
import { teamMembershipController } from "./teammembership.controller";
import authMiddleware from "../../middleware/authentication";
import { OrganizationRole, PlatformRole } from "../../../generated/enums";
import organizationAccessMiddleware from "../../middleware/organizationAccessMiddleware";
import { validateData } from "../../middleware/validator.middleware";
import { addTeamMemberValidationSchema } from "./teammembership.validation";
import subscriptionMiddleware from "../../middleware/subscriptionMiddleware";

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

router.get(
	"/:slug/teams/:teamId/members",
	authMiddleware(PlatformRole.USER),
	subscriptionMiddleware,
	organizationAccessMiddleware(
		OrganizationRole.OWNER,
		OrganizationRole.ORG_ADMIN,
	),
	teamMembershipController.getAllTeamMembersController,
);

router.get(
  "/:slug/teams/:teamId/members/:teamMemberId",
  authMiddleware(PlatformRole.USER),
  subscriptionMiddleware,
  organizationAccessMiddleware(),
  teamMembershipController.getSingleTeamMemberController,
);

router.delete(
  "/:slug/teams/:teamId/members/:teamMemberId",
  authMiddleware(PlatformRole.USER),
  subscriptionMiddleware,
  organizationAccessMiddleware(
    OrganizationRole.ORG_ADMIN,
    OrganizationRole.OWNER,
  ),
  teamMembershipController.deleteTeamMemberController,
);



export const teamMembershipRouter = router;
