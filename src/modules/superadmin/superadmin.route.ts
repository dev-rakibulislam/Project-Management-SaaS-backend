import { Router } from "express";
import authMiddleware from "../../middleware/authentication";
import { PlatformRole } from "../../../generated/enums";
import { superAdminController } from "./superadmin.controller";

const router = Router();

router.get(
	"/users",
	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.getAllUsers,
);

router.get(
	"/organizations",
	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.getAllOrganizations,
);

router.get(
	"/statistics",
	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.getPlatformStatistics,
);

router.patch(
	"/users/:userId/suspend",
	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.suspendUser,
);

router.patch(
	"/users/:userId/restore",

	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.restoreUser,
);
router.get(
	"/payments",
	authMiddleware(PlatformRole.SUPER_ADMIN),
	superAdminController.getAllPayments,
);

export const superAdminRouter = router;
