import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MemoryService } from './memory.service';

@ApiTags('Career Memory')
@Controller('memory')
export class MemoryController {
  constructor(private service: MemoryService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Store a career memory' })
  async create(@Param('userId') userId: string, @Body() body: any) {
    return this.service.create(userId, body);
  }

  @Get(':userId/search')
  @ApiOperation({ summary: 'Search career memories' })
  async search(@Param('userId') userId: string, @Query('q') query: string) {
    return this.service.search(userId, query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get career memory timeline' })
  async timeline(@Param('userId') userId: string) {
    return this.service.getTimeline(userId);
  }
}
