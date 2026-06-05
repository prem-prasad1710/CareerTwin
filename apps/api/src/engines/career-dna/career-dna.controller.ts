import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CareerDnaService } from './career-dna.service';

@ApiTags('Career DNA')
@Controller('career-dna')
export class CareerDnaController {
  constructor(private service: CareerDnaService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Generate Career DNA profile with radar chart data' })
  async getCareerDna(@Param('userId') userId: string) {
    return this.service.compute(userId);
  }
}
