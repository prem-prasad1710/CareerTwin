import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get complete dashboard overview' })
  async overview(@Param('userId') userId: string) {
    return this.service.getOverview(userId);
  }
}
