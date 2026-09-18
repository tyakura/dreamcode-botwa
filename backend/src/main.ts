import "reflect-metadata";
import { HttpException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cors from "cors";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(
    cors({
      origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
      credentials: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formatted = errors.map((e) => ({
          field: e.property,
          message: Object.values(e.constraints || {})[0] || "Tidak valid",
        }));
        return new HttpException(
          { message: "Validasi gagal", errors: formatted },
          400,
        );
      },
    }),
  );

  const port = Number(process.env.PORT) || 3000;

  console.log(`\n========================================`);
  console.log(`  DreamCode BotWA Backend (NestJS)`);
  console.log(`  Running on: http://localhost:${port}`);
  console.log(`  Health:     http://localhost:${port}/health`);
  console.log(`========================================\n`);

  await app.listen(port);
}

bootstrap();