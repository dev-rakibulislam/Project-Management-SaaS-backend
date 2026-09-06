// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { paymentController } from "./payment.controller";
import { PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import authMiddleware from "../../middleware/authentication";
import { createPaymentSchema } from "./payment.validation";
const router = Router();

router.post(
	"/",
	authMiddleware(PlatformRole.USER),
	validateData(createPaymentSchema),
	paymentController.createPaymentController,
);

// router.post("/success", paymentController.verifyPaymentController);
// router.post("/fail", paymentController.failPaymentController);

// router.get(
// 	"/",
// 	authMiddleware(UserRole.CUSTOMER),
// 	paymentController.getMyPaymentPaymentController,
// );

// router.get(
// 	"/:id",
// 	authMiddleware(UserRole.CUSTOMER),
// 	paymentController.getSinglePaymentController,
// );

export const paymentRouter = router;
