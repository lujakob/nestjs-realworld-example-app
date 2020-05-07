import { Get, Post, Delete, Param, Controller, HttpCode } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileRO } from "./profile.dto";
import { User } from "../user/user.decorator";

import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("profiles")
@Controller("profiles")
@ApiResponse({
  type: ProfileRO,
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":username")
  @ApiOperation({
    summary: "Get Profile",
    operationId: "GetProfile",
  })
  async getProfile(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @Post(":username/follow")
  @HttpCode(200)
  @ApiOperation({
    summary: "Follow User",
    operationId: "FollowUser",
  })
  async follow(
    @User("email") email: string,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  @Delete(":username/follow")
  @ApiOperation({
    summary: "UnFollow User",
    operationId: "UnFollowUser",
  })
  async unFollow(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }
}
