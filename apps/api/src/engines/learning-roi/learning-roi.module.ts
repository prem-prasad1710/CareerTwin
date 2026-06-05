import { Module } from '@nestjs/common';
import { LearningRoiService } from './learning-roi.service';
import { LearningRoiController } from './learning-roi.controller';

@Module({
  controllers: [LearningRoiController],
  providers: [LearningRoiService],
  exports: [LearningRoiService],
})
export class LearningRoiModule {}
