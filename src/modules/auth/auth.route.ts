import { Router } from "express";

import { authController } from "./auth.controller";
import { validateData } from "../../middleware/validator.middleware";
import { userLoginSchema, userRegisterSchema } from "./auth.validation";
import authMiddleware from "../../middleware/authentication";

const router = Router();

router.post(
	"/register",
	validateData(userRegisterSchema),
	authController.registerUserController,
);

router.post(
	"/login",
	validateData(userLoginSchema),
	authController.loginUserController,
);

router.get("/me", authMiddleware(), authController.getMyProfile);

export const authRouter = router;
