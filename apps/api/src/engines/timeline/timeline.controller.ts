import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TimelineService } from './timeline.service';

@ApiTags('Timeline')
@Controller('timeline')
export class TimelineController {
  constructor(private service: TimelineService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Generate career timeline predictions with confidence scores' })
  async predict(@Param('userId') userId: string) {
    return this.service.predict(userId);
  }
}
