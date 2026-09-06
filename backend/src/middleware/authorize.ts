import { Request, Response, NextFunction } from "express";
import { AuthedRequest } from "@/middleware/auth";

const SUPER_ADMIN = "SUPER_ADMIN";
const ADMIN = "ADMIN";
const BUSINESS_OWNER = "BUSINESS_OWNER";
const STAFF_CS = "STAFF_CS";

export function requireRoles(...roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Tidak terautentikasi" });
    }
    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({ message: "Akses ditolak: role tidak diizinkan" });
    }
    next();
  };
}

export { SUPER_ADMIN, ADMIN, BUSINESS_OWNER, STAFF_CS };
