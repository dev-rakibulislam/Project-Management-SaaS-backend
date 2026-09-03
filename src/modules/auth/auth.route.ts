import { Router } from "express";

import { authController } from "./auth.controller";

const router = Router();

router.post("/", authController.createAuth);

router.get("/", authController.getAuths);

router.get("/:id", authController.getAuth);

router.patch("/:id", authController.updateAuth);

router.delete("/:id", authController.deleteAuth);

export const authRouter = router;
