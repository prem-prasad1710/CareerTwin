import { Module } from '@nestjs/common';
import { CareerDnaService } from './career-dna.service';
import { CareerDnaController } from './career-dna.controller';

@Module({
  controllers: [CareerDnaController],
  providers: [CareerDnaService],
  exports: [CareerDnaService],
})
export class CareerDnaModule {}
