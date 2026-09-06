import { Router } from "express";
import {
  listCustomers, getCustomer, createCustomer, updateCustomer,
  updateCustomerStatus, toggleSelected, getStatusHistory, deleteCustomer,
} from "@/controllers/customer.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listCustomers);
router.post("/", createCustomer);
router.get("/:id", getCustomer);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.patch("/:id/status", updateCustomerStatus);
router.patch("/:id/select", toggleSelected);
router.get("/:id/status-history", getStatusHistory);

export default router;