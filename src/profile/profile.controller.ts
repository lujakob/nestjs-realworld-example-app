import { Get, Post, Delete, Req, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { User } from '../user/user.decorator';

@Controller()
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get('profiles/:username')
  async getProfile(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @Post('profiles/:username/follow')
  async follow(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(userId, username);
  }

  @Delete('profiles/:username/follow')
  async unFollow(@User('id') userId: number,  @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }

}