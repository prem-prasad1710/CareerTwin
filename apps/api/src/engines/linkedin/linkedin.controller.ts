import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LinkedinService } from './linkedin.service';

@ApiTags('LinkedIn Intelligence')
@Controller('linkedin')
export class LinkedinController {
  constructor(private service: LinkedinService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Analyze LinkedIn presence and personal brand' })
  async analyze(@Param('userId') userId: string) {
    return this.service.analyze(userId);
  }
}
