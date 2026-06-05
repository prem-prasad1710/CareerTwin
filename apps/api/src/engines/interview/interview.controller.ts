import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InterviewService } from './interview.service';

@ApiTags('Interview Predictor')
@Controller('interview')
export class InterviewController {
  constructor(private service: InterviewService) {}

  @Get(':userId/predictions')
  @ApiOperation({ summary: 'Predict interview success probability by company' })
  async predict(@Param('userId') userId: string) {
    return this.service.predict(userId);
  }
}
