import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService, SyncUserDto } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync user from OAuth (GitHub, Google) or demo login' })
  async sync(@Body() body: SyncUserDto) {
    return this.service.syncUser(body);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile with career data' })
  async getProfile(@Param('userId') userId: string) {
    return this.service.getProfile(userId);
  }

  @Put(':userId/profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Param('userId') userId: string, @Body() body: Record<string, unknown>) {
    return this.service.updateProfile(userId, body);
  }
}
