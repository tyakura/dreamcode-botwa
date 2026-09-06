import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: errors.array().map((e) => ({ field: (e as any).param, message: e.msg })),
    });
  }
  next();
}
