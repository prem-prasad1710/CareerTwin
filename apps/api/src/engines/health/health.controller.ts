import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Career Health')
@Controller('health')
export class HealthController {
  constructor(private service: HealthService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get executive career health dashboard metrics' })
  async compute(@Param('userId') userId: string) {
    return this.service.compute(userId);
  }
}
