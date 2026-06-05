import { Module } from '@nestjs/common';
import { MarketValueService } from './market-value.service';
import { MarketValueController } from './market-value.controller';

@Module({
  controllers: [MarketValueController],
  providers: [MarketValueService],
  exports: [MarketValueService],
})
export class MarketValueModule {}
