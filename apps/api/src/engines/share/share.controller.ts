import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShareService } from './share.service';

@ApiTags('Share Cards')
@Controller('share')
export class ShareController {
  constructor(private service: ShareService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a shareable career report card' })
  async create(
    @Param('userId') userId: string,
    @Body() body: { type: string; title: string; data: Record<string, unknown> },
  ) {
    return this.service.create(userId, body.type, body.title, body.data);
  }

  @Get('card/:shareUrl')
  @ApiOperation({ summary: 'Get a shared card by URL' })
  async get(@Param('shareUrl') shareUrl: string) {
    return this.service.get(shareUrl);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'List user share cards' })
  async list(@Param('userId') userId: string) {
    return this.service.list(userId);
  }
}
