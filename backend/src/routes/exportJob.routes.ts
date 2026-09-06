import { Router } from "express";
import {
  createExportJob, listExportJobs, getExportJob, processExportJob, failExportJob,
} from "@/controllers/exportJob.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listExportJobs);
router.post("/", createExportJob);
router.get("/:id", getExportJob);
router.post("/:id/process", processExportJob);
router.post("/:id/fail", failExportJob);

export default router;