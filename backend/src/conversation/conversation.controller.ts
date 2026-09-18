import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { setAudit } from "../common/audit.util";

@Controller("api/businesses/:businessId/conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.conversationService.list(businessId, query);
  }

  @Post()
  create(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.conversationService.create(businessId, body).then((conversation) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "CONVERSATION",
        entityId: conversation.id,
      });
      return conversation;
    });
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.conversationService.getOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.conversationService.update(id, body).then((conversation) => {
      setAudit(req, {
        businessId: conversation.businessId,
        action: "UPDATE",
        entity: "CONVERSATION",
        entityId: conversation.id,
        metadata: { status: body.status, assignedTo: body.assignedTo },
      });
      return conversation;
    });
  }

  @Patch(":id/close")
  close(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.conversationService.close(id).then((conversation) => {
      setAudit(req, {
        businessId: conversation.businessId,
        action: "CLOSE",
        entity: "CONVERSATION",
        entityId: conversation.id,
      });
      return conversation;
    });
  }

  // ===== Messages =====

  @Get(":conversationId/messages")
  listMessages(@Param("conversationId", ParseIntPipe) conversationId: number) {
    return this.conversationService.listMessages(conversationId);
  }

  @Post(":conversationId/messages")
  sendMessage(@Param("conversationId", ParseIntPipe) conversationId: number, @Body() body: any) {
    return this.conversationService.sendMessage(conversationId, body);
  }
}