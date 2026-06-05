import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SkillGapService } from './skill-gap.service';

@ApiTags('Skill Gap')
@Controller('skill-gap')
export class SkillGapController {
  constructor(private service: SkillGapService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Analyze skill gaps for target role' })
  @ApiQuery({ name: 'targetRole', required: true })
  async analyze(
    @Param('userId') userId: string,
    @Query('targetRole') targetRole: string,
  ) {
    return this.service.analyze(userId, targetRole);
  }
}
