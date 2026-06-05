import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MarketValueService } from './market-value.service';

@ApiTags('Market Value')
@Controller('market-value')
export class MarketValueController {
  constructor(private service: MarketValueService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Estimate current and future market value' })
  async getMarketValue(@Param('userId') userId: string) {
    return this.service.compute(userId);
  }
}
