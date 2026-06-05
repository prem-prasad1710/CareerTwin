import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimulatorService } from './simulator.service';
import { SimulationInput } from '@careertwin/shared';

@ApiTags('Career Simulator')
@Controller('simulator')
export class SimulatorController {
  constructor(private service: SimulatorService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Simulate a career decision and predict outcomes' })
  async simulate(@Param('userId') userId: string, @Body() input: SimulationInput) {
    return this.service.simulate(userId, input);
  }

  @Get(':userId/history')
  @ApiOperation({ summary: 'Get simulation history' })
  async history(@Param('userId') userId: string) {
    return this.service.getHistory(userId);
  }
}
