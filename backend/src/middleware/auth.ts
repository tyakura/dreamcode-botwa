import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";

export interface AuthedRequest extends Request {
  user?: {
    id: number;
    email: string;
    roleId: number;
    roleName: string;
  };
}

export function authenticate(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tidak terautentikasi" });
  }

  try {
    const payload = verifyToken(header.split(" ")[1]);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
  }
}
