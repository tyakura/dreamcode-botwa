import { Module } from "@nestjs/common";
import { ExportJobController } from "./export-job.controller";
import { ExportJobService } from "./export-job.service";

@Module({
  controllers: [ExportJobController],
  providers: [ExportJobService],
})
export class ExportJobModule {}