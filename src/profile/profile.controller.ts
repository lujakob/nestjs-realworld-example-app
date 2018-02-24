import { Get, Post, Delete, Req, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';

@Controller()
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get('profiles/:username')
  async getProfile(@Req() {authUserId}: Request, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(authUserId, username);
  }

  @Post('profiles/:username/follow')
  async follow(@Req() {authUserId}: Request, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(authUserId, username);
  }

  @Delete('profiles/:username/follow')
  async unFollow(@Req() {authUserId}: Request, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(authUserId, username);
  }

}