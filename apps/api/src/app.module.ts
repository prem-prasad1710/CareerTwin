import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { CareerDnaModule } from './engines/career-dna/career-dna.module';
import { CareerScoreModule } from './engines/career-score/career-score.module';
import { MarketValueModule } from './engines/market-value/market-value.module';
import { SkillGapModule } from './engines/skill-gap/skill-gap.module';
import { SimulatorModule } from './engines/simulator/simulator.module';
import { TimelineModule } from './engines/timeline/timeline.module';
import { InterviewModule } from './engines/interview/interview.module';
import { MemoryModule } from './engines/memory/memory.module';
import { CoachModule } from './engines/coach/coach.module';
import { JobMatchModule } from './engines/job-match/job-match.module';
import { LearningRoiModule } from './engines/learning-roi/learning-roi.module';
import { GithubModule } from './engines/github/github.module';
import { LinkedinModule } from './engines/linkedin/linkedin.module';
import { RiskModule } from './engines/risk/risk.module';
import { HealthModule } from './engines/health/health.module';
import { ShareModule } from './engines/share/share.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    AiModule,
    UsersModule,
    DashboardModule,
    CareerDnaModule,
    CareerScoreModule,
    MarketValueModule,
    SkillGapModule,
    SimulatorModule,
    TimelineModule,
    InterviewModule,
    MemoryModule,
    CoachModule,
    JobMatchModule,
    LearningRoiModule,
    GithubModule,
    LinkedinModule,
    RiskModule,
    HealthModule,
    ShareModule,
  ],
})
export class AppModule {}
