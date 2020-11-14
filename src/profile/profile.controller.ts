import { Get, Post, Delete, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth, ApiParam, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) { }

  @ApiParam({ name: 'username', type: 'string' })
  @Get(':username')
  async getProfile(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @ApiParam({ name: 'username', type: 'string' })
  @Post(':username/follow')
  async follow(@User('email') email: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  @ApiParam({ name: 'username', type: 'string', description: "follow's name" })
  @Delete(':username/follow')
  async unFollow(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }

}