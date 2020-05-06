import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { ProfileRO, ProfileDataDto } from "./profile.dto";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne(options);
    delete user.id;
    if (user) delete user.password;
    return user;
  }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      },
      relations: ["follower"],
    });

    if (!_profile) return;

    let profile: ProfileDataDto = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
    };

    const follows = _profile.follower.some((item) => item.id === id);

    if (id) {
      profile.following = follows;
    }

    return { profile };
  }

  async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException(
        "Follower email and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const followingUser = await this.userRepository.findOne({
      where: { username },
      relations: ["follower"],
    });
    const followerUser = await this.userRepository.findOne({
      where: {
        email: followerEmail,
      },
      relations: ["following"],
    });

    if (followingUser.email === followerEmail) {
      throw new HttpException(
        "FollowerEmail and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }

    const _follows = followingUser.follower.some(
      (item) => item.id === followerUser.id
    );

    if (!_follows) {
      followingUser.follower.push(followerUser);
      followerUser.following.push(followingUser);
      await this.userRepository.save(followingUser);
      await this.userRepository.save(followerUser);
    }

    let profile: ProfileDataDto = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    return { profile };
  }

  async unFollow(followerId: number, username: string): Promise<ProfileRO> {
    if (!followerId || !username) {
      throw new HttpException(
        "FollowerId and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const followingUser = await this.userRepository.findOne({
      where: { username },
      relations: ["follower"],
    });
    const followerUser = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ["following"],
    });
    const followingId = followingUser.id;

    if (followingId === followerId) {
      throw new HttpException(
        "FollowerId and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }

    const deleteFollowerIndex = followingUser.follower.findIndex(
      (item) => item.id === followerId
    );
    const deleteFollowingIndex = followerUser.following.findIndex(
      (item) => item.id === followingId
    );

    followingUser.follower.splice(deleteFollowerIndex, 1);
    followerUser.following.splice(deleteFollowingIndex, 1);
    await this.userRepository.save(followerUser);
    await this.userRepository.save(followingUser);

    let profile: ProfileDataDto = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return { profile };
  }
}
