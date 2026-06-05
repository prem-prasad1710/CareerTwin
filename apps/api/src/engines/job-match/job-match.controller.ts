import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobMatchService } from './job-match.service';

@ApiTags('Job Match')
@Controller('job-match')
export class JobMatchController {
  constructor(private service: JobMatchService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get job matches with scores' })
  async match(@Param('userId') userId: string) {
    return this.service.match(userId);
  }
}
