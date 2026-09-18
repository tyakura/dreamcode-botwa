import {
  ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return response
        .status(status)
        .json(typeof body === "string" ? { message: body } : body);
    }

    const err = exception as {
      code?: string;
      name?: string;
      message?: string;
      status?: number;
    };

    if (err?.code === "P2002") {
      return response.status(409).json({ message: "Data sudah ada (duplikat)" });
    }
    if (err?.code === "P2025") {
      return response.status(404).json({ message: "Data tidak ditemukan" });
    }
    if (err?.name === "PrismaClientKnownRequestError") {
      return response
        .status(400)
        .json({ message: "Kesalahan database: " + err.message });
    }

    console.error("Error:", err);
    return response
      .status(err?.status || 500)
      .json({ message: err?.message || "Terjadi kesalahan server" });
  }
}