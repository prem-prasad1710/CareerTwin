import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GithubService } from './github.service';

@ApiTags('GitHub Intelligence')
@Controller('github')
export class GithubController {
  constructor(private service: GithubService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Analyze GitHub profile and generate engineering scores' })
  async analyze(@Param('userId') userId: string, @Query('username') username?: string) {
    return this.service.analyze(userId, username);
  }
}
