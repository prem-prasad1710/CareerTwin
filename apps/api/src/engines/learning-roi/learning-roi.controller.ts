import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LearningRoiService } from './learning-roi.service';

@ApiTags('Learning ROI')
@Controller('learning-roi')
export class LearningRoiController {
  constructor(private service: LearningRoiService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Calculate learning ROI for skills' })
  async compute(@Param('userId') userId: string) {
    return this.service.compute(userId);
  }
}
