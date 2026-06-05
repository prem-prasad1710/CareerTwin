import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RiskService } from './risk.service';

@ApiTags('Career Risk')
@Controller('risk')
export class RiskController {
  constructor(private service: RiskService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Detect career risks and generate recommendations' })
  async detect(@Param('userId') userId: string) {
    return this.service.detect(userId);
  }
}
