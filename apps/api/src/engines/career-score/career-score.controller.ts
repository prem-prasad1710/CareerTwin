import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CareerScoreService } from './career-score.service';

@ApiTags('Career Score')
@Controller('career-score')
export class CareerScoreController {
  constructor(private service: CareerScoreService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Calculate dynamic career score with peer benchmarking' })
  async getScore(@Param('userId') userId: string) {
    return this.service.compute(userId);
  }
}
