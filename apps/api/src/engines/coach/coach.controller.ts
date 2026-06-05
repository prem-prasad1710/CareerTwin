import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { ChatMessage } from '@careertwin/shared';

@ApiTags('AI Coach')
@Controller('coach')
export class CoachController {
  constructor(private service: CoachService) {}

  @Get('agents')
  @ApiOperation({ summary: 'List available AI agents' })
  async agents() {
    return this.service.getAgents();
  }

  @Post(':userId/chat')
  @ApiOperation({ summary: 'Chat with AI career coach' })
  async chat(
    @Param('userId') userId: string,
    @Body() body: { messages: ChatMessage[]; agent?: string },
  ) {
    return this.service.chat(userId, body.messages, body.agent);
  }
}
