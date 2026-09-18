import { Module } from "@nestjs/common";
import { ForbiddenDataController } from "./forbidden-data.controller";
import { ForbiddenDataService } from "./forbidden-data.service";

@Module({
  controllers: [ForbiddenDataController],
  providers: [ForbiddenDataService],
})
export class ForbiddenDataModule {}