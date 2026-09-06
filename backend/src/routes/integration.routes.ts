import { Router } from "express";
import {
  listIntegrations, connectIntegration, disconnectIntegration,
  listSyncLogs, syncEntity, updateSyncStatus,
} from "@/controllers/integration.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listIntegrations);
router.post("/connect", connectIntegration);
router.patch("/:id/disconnect", disconnectIntegration);

router.get("/sync-logs", listSyncLogs);
router.post("/:integrationId/sync", syncEntity);
router.patch("/sync-logs/:id", updateSyncStatus);

export default router;