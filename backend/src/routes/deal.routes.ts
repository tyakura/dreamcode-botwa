import { Router } from "express";
import {
  listDeals, getDeal, createDeal, updateDeal, getDealStats, deleteDeal,
} from "@/controllers/deal.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listDeals);
router.post("/", createDeal);
router.get("/stats", getDealStats);
router.get("/:id", getDeal);
router.patch("/:id", updateDeal);
router.delete("/:id", deleteDeal);

export default router;