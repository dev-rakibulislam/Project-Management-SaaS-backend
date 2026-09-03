import { Router } from "express";

import { auditlogController } from "./auditlog.controller";

const router = Router();

router.post("/", auditlogController.createAuditlog);

router.get("/", auditlogController.getAuditlogs);

router.get("/:id", auditlogController.getAuditlog);

router.patch("/:id", auditlogController.updateAuditlog);

router.delete("/:id", auditlogController.deleteAuditlog);

export const auditlogRouter = router;
