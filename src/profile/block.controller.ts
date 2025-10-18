import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.decorator";
import { BlockService } from "./block.service";
import { ProfileRO } from "./profile.interface";
import { BaseController } from "../shared/base.controller";

@ApiBearerAuth()
@ApiTags("profiles")
@Controller("profiles")
export class BlockController extends BaseController {
  constructor(private readonly blockService: BlockService) {
    super();
  }

  @Post(":username/block")
  async blockUser(
    @User("email") email: string,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.blockService.blockUser(email, username);
  }

  @Delete(":username/block")
  async unblockUser(
    @User("email") email: string,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.blockService.unblockUser(email, username);
  }

  @Get("blocked")
  async getBlockedUsers(@User("email") email: string): Promise<ProfileRO[]> {
    return await this.blockService.getBlockedUsers(email);
  }
}
