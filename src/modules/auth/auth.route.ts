import { Router } from "express";

import { authController } from "./auth.controller";
import { validateData } from "../../middleware/validator.middleware";
import { userLoginSchema, userRegisterSchema } from "./auth.validation";

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


export const authRouter = router;
