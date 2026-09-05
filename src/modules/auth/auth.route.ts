import { Router } from "express";

import { authController } from "./auth.controller";
import { validateData } from "../../middleware/validator.middleware";
import { userRegisterSchema } from "./auth.validation";

const router = Router();

router.post(
	"/register",
	validateData(userRegisterSchema),
	authController.registerUserController,
);

// router.get("/", authController.getMyProfileController);

// router.patch("/:id", authController.updateMyProfileController);

// router.delete("/:id", authController.deleteAuth);

export const authRouter = router;
