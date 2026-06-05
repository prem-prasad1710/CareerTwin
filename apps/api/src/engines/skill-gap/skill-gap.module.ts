import { Module } from '@nestjs/common';
import { SkillGapService } from './skill-gap.service';
import { SkillGapController } from './skill-gap.controller';

@Module({
  controllers: [SkillGapController],
  providers: [SkillGapService],
  exports: [SkillGapService],
})
export class SkillGapModule {}
