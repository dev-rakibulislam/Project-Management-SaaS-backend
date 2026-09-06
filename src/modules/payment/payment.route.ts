// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";

import { paymentController } from "./payment.controller";
import { PlatformRole } from "../../../generated/enums";
import { validateData } from "../../middleware/validator.middleware";
import authMiddleware from "../../middleware/authentication";
import {
	createPaymentSchema,
	getSinglePaymentSchema,
} from "./payment.validation";
const router = Router();

router.post(
	"/",
	authMiddleware(PlatformRole.USER),
	validateData(createPaymentSchema),
	paymentController.createPaymentController,
);

router.post("/success", paymentController.verifyPaymentController);
router.post("/fail", paymentController.failPaymentController);

router.get(
	"/",
	authMiddleware(PlatformRole.USER),
	paymentController.getMyPaymentPaymentController,
);

router.get(
	"/:id",
	authMiddleware(PlatformRole.USER),
	paymentController.getSinglePaymentController,
);

export const paymentRouter = router;
