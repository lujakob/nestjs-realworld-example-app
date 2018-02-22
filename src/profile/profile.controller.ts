import {Get, Post, Delete, Param, Controller, Headers} from '@nestjs/common';

import { User } from '../user/user.entity';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { SECRET } from '../config';
import * as jwt from 'jsonwebtoken';

@Controller()
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get('profiles/:username')
  async getProfile(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(this.getUserIdFromToken(authorization), username);
  }

  @Post('profiles/:username/follow')
  async follow(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    return await this.profileService.follow(decoded.id, username);
  }

  @Delete('profiles/:username/follow')
  async unFollow(@Headers('authorization') authorization: string, @Param('username') username: string): Promise<ProfileRO> {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    return await this.profileService.unFollow(decoded.id, username);
  }

  getUserIdFromToken(authorization) {
    if (!authorization) return null;
    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, SECRET);
    return decoded.id;
  }
}