import { Router } from "express";
import {
  listRoles, createRole, listUsers, getUser, updateUser, deleteUser,
} from "@/controllers/user.controller";
import { authenticate } from "@/middleware/auth";
import { requireRoles, ADMIN, SUPER_ADMIN } from "@/middleware/authorize";

const router = Router();

router.use(authenticate);

router.get("/roles", listRoles);
router.post("/roles", requireRoles(SUPER_ADMIN, ADMIN), createRole);

router.get("/users", requireRoles(SUPER_ADMIN, ADMIN), listUsers);
router.get("/users/:id", requireRoles(SUPER_ADMIN, ADMIN), getUser);
router.patch("/users/:id", requireRoles(SUPER_ADMIN, ADMIN), updateUser);
router.delete("/users/:id", requireRoles(SUPER_ADMIN), deleteUser);

export default router;
