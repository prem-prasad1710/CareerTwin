import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CareerDnaModule } from '../engines/career-dna/career-dna.module';
import { CareerScoreModule } from '../engines/career-score/career-score.module';
import { MarketValueModule } from '../engines/market-value/market-value.module';
import { HealthModule } from '../engines/health/health.module';
import { LearningRoiModule } from '../engines/learning-roi/learning-roi.module';
import { RiskModule } from '../engines/risk/risk.module';

@Module({
  imports: [
    CareerDnaModule,
    CareerScoreModule,
    MarketValueModule,
    HealthModule,
    LearningRoiModule,
    RiskModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
