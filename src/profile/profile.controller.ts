import { Get, Post, Delete, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { User } from '../user/user.decorator';

import {
  ApiUseTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('profiles')
@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @Post(':username/follow')
  async follow(@User('email') email: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  @Delete(':username/follow')
  async unFollow(@User('id') userId: number,  @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }

}