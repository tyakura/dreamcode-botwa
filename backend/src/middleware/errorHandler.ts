import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Data sudah ada (duplikat)" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({ message: "Kesalahan database: " + err.message });
  }

  res.status(err.status || 500).json({ message: err.message || "Terjadi kesalahan server" });
}
