import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { UserBlockEntity } from "../user/user-block.entity";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { ProfileRO } from "./profile.interface";

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserBlockEntity)
    private readonly userBlockRepository: Repository<UserBlockEntity>
  ) {}

  async blockUser(blockerEmail: string, username: string): Promise<ProfileRO> {
    if (!blockerEmail || !username) {
      throw new HttpException(
        "Blocker email and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const userToBlock = await this.userRepository.findOne({ username });
    const blockerUser = await this.userRepository.findOne({
      email: blockerEmail,
    });

    if (!userToBlock || !blockerUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (userToBlock.email === blockerEmail) {
      throw new HttpException(
        "Users cannot block themselves",
        HttpStatus.BAD_REQUEST
      );
    }

    const existingBlock = await this.userBlockRepository.findOne({
      where: {
        blocker: { id: blockerUser.id },
        blocked: { id: userToBlock.id },
      },
    });

    if (!existingBlock) {
      const block = new UserBlockEntity();
      block.blocker = blockerUser;
      block.blocked = userToBlock;
      await this.userBlockRepository.save(block);
    }

    return {
      profile: {
        username: userToBlock.username,
        bio: userToBlock.bio,
        image: userToBlock.image,
        blocked: true,
      },
    };
  }

  async unblockUser(
    blockerEmail: string,
    username: string
  ): Promise<ProfileRO> {
    if (!blockerEmail || !username) {
      throw new HttpException(
        "Blocker email and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const userToUnblock = await this.userRepository.findOne({ username });
    const blockerUser = await this.userRepository.findOne({
      email: blockerEmail,
    });

    if (!userToUnblock || !blockerUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    await this.userBlockRepository.delete({
      blocker: { id: blockerUser.id },
      blocked: { id: userToUnblock.id },
    });

    return {
      profile: {
        username: userToUnblock.username,
        bio: userToUnblock.bio,
        image: userToUnblock.image,
        blocked: false,
      },
    };
  }

  async getBlockedUsers(userEmail: string): Promise<ProfileRO[]> {
    const user = await this.userRepository.findOne({ email: userEmail });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const blockedUsers = await this.userBlockRepository.find({
      where: { blocker: { id: user.id } },
      relations: ["blocked"],
    });

    return blockedUsers.map((block) => ({
      profile: {
        username: block.blocked.username,
        bio: block.blocked.bio,
        image: block.blocked.image,
        blocked: true,
      },
    }));
  }
}
