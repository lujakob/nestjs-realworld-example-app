import { Get, Post, Delete, Param, Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  getProfile(@User('id') userId: number, @Param('username') username: string): Promise<ProfileRO> {
    return this.profileService.findProfile(userId, username);
  }

  @Post(':username/follow')
  follow(@User('email') email: string, @Param('username') username: string): Promise<ProfileRO> {
    return this.profileService.follow(email, username);
  }

  @Delete(':username/follow')
  unFollow(@User('id') userId: number,  @Param('username') username: string): Promise<ProfileRO> {
    return this.profileService.unFollow(userId, username);
  }

}
