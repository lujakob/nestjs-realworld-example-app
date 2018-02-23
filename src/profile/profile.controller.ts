import { Get, Post, Delete, Param, Controller, Headers } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { BaseController } from '../shared/base.controller';

@Controller()
export class ProfileController extends BaseController {

  constructor(private readonly profileService: ProfileService) {
    super();
  }

  @Get('profiles/:username')
  async getProfile(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(this.getUserIdFromToken(authorization), username);
  }

  @Post('profiles/:username/follow')
  async follow(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(this.getUserIdFromToken(authorization), username);
  }

  @Delete('profiles/:username/follow')
  async unFollow(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(this.getUserIdFromToken(authorization), username);
  }

}