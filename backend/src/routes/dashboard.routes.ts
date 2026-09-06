import { Router } from "express";
import { getDashboardStats, getCustomerStatusDistribution } from "@/controllers/dashboard.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/stats", getDashboardStats);
router.get("/customer-status", getCustomerStatusDistribution);

export default router;