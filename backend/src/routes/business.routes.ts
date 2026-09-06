import { Router } from "express";
import {
  listBusinesses, getBusiness, createBusiness, updateBusiness, deleteBusiness,
  listMembers, addMember, updateMember, removeMember,
} from "@/controllers/business.controller";
import { authenticate } from "@/middleware/auth";
import { requireRoles, SUPER_ADMIN, ADMIN, BUSINESS_OWNER } from "@/middleware/authorize";

const router = Router();

router.use(authenticate);

router.get("/", requireRoles(SUPER_ADMIN, ADMIN), listBusinesses);
router.get("/:id", getBusiness);
router.post("/", createBusiness);
router.patch("/:id", requireRoles(SUPER_ADMIN, BUSINESS_OWNER), updateBusiness);
router.delete("/:id", requireRoles(SUPER_ADMIN), deleteBusiness);

router.get("/:businessId/members", listMembers);
router.post("/:businessId/members", requireRoles(SUPER_ADMIN, BUSINESS_OWNER), addMember);
router.patch("/members/:id", requireRoles(SUPER_ADMIN, BUSINESS_OWNER), updateMember);
router.delete("/members/:id", requireRoles(SUPER_ADMIN, BUSINESS_OWNER), removeMember);

export default router;
