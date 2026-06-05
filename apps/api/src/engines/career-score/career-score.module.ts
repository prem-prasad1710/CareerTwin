import { Module } from '@nestjs/common';
import { CareerScoreService } from './career-score.service';
import { CareerScoreController } from './career-score.controller';

@Module({
  controllers: [CareerScoreController],
  providers: [CareerScoreService],
  exports: [CareerScoreService],
})
export class CareerScoreModule {}
