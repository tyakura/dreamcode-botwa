import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/public.decorator";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: "OK", timestamp: new Date().toISOString() };
  }
}

@Controller()
export class RootController {
  @Public()
  @Get()
  info() {
    return {
      name: "DreamCode BotWA - AI WhatsApp Business Agent API",
      version: "2.0.0",
      status: "running",
    };
  }
}