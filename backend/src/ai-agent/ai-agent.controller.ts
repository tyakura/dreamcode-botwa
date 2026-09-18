import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { AiAgentService } from "./ai-agent.service";
import { setAudit } from "../common/audit.util";

@Controller("api/businesses/:businessId/agents")
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.aiAgentService.listAgents(businessId);
  }

  @Post()
  create(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.aiAgentService.createAgent(businessId, body).then((agent) => {
      setAudit(req, { businessId, action: "CREATE", entity: "AI_AGENT", entityId: agent.id });
      return agent;
    });
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.aiAgentService.updateAgent(id, body).then((agent) => {
      setAudit(req, { businessId: agent.businessId, action: "UPDATE", entity: "AI_AGENT", entityId: agent.id });
      return agent;
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.aiAgentService.removeAgent(id).then((agent) => {
      setAudit(req, { businessId: agent.businessId, action: "DELETE", entity: "AI_AGENT", entityId: id });
      return { message: "AI Agent dihapus" };
    });
  }

  // ==== Knowledge Base ====

  @Get("knowledge")
  listKnowledge(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.aiAgentService.listKnowledge(businessId);
  }

  @Post("knowledge")
  createKnowledge(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.aiAgentService.createKnowledge(businessId, body).then((item) => {
      setAudit(req, { businessId, action: "CREATE", entity: "KNOWLEDGE_BASE", entityId: item.id });
      return item;
    });
  }

  @Patch("knowledge/:id")
  updateKnowledge(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.aiAgentService.updateKnowledge(id, body).then((item) => {
      setAudit(req, { businessId: item.businessId, action: "UPDATE", entity: "KNOWLEDGE_BASE", entityId: item.id });
      return item;
    });
  }

  @Delete("knowledge/:id")
  removeKnowledge(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.aiAgentService.removeKnowledge(id).then((item) => {
      setAudit(req, { businessId: item.businessId, action: "DELETE", entity: "KNOWLEDGE_BASE", entityId: id });
      return { message: "Knowledge dihapus" };
    });
  }
}