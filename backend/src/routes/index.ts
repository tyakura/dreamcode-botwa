import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import businessRoutes from "@/routes/business.routes";
import customerRoutes from "@/routes/customer.routes";
import conversationRoutes from "@/routes/conversation.routes";
import dealRoutes from "@/routes/deal.routes";
import aiAgentRoutes from "@/routes/aiAgent.routes";
import followUpRoutes from "@/routes/followUp.routes";
import forbiddenDataRoutes from "@/routes/forbiddenData.routes";
import integrationRoutes from "@/routes/integration.routes";
import exportJobRoutes from "@/routes/exportJob.routes";
import notificationRoutes from "@/routes/notification.routes";
import dashboardRoutes from "@/routes/dashboard.routes";
import { audit } from "@/middleware/audit";

const router = Router();

// Public
router.use("/api/auth", authRoutes);

// Protected - semua route di bawah butuh token (authenticate ada di tiap module route)
router.use("/api", audit);

router.use("/api", userRoutes);
router.use("/api/businesses", businessRoutes);

// Semua resource di bawah ber-scope ke business (businessId di URL)
router.use("/api/businesses/:businessId/customers", customerRoutes);
router.use("/api/businesses/:businessId/conversations", conversationRoutes);
router.use("/api/businesses/:businessId/deals", dealRoutes);
router.use("/api/businesses/:businessId/agents", aiAgentRoutes);
router.use("/api/businesses/:businessId/follow-ups", followUpRoutes);
router.use("/api/businesses/:businessId/forbidden", forbiddenDataRoutes);
router.use("/api/businesses/:businessId/integrations", integrationRoutes);
router.use("/api/businesses/:businessId/exports", exportJobRoutes);
router.use("/api/businesses/:businessId/notifications", notificationRoutes);
router.use("/api/businesses/:businessId/dashboard", dashboardRoutes);

export default router;