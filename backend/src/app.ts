import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "@/routes";
import { errorHandler } from "@/middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    name: "DreamCode BotWA - AI WhatsApp Business Agent API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

export default app;