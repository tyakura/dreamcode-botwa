import { Router } from "express";
import { login, register, loginValidators, registerValidators } from "@/controllers/auth.controller";

const router = Router();

router.post("/login", loginValidators, login);
router.post("/register", registerValidators, register);

export default router;
