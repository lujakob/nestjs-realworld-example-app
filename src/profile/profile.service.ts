import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ProfileRO, ProfileData } from "./profile.interface";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(options?: any): Promise<ProfileRO> {
    const user = await this.prisma.user.findFirst(options);
    if (user) {
      delete user.id;
      delete user.password;
    }
    return { profile: user };
  }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.prisma.user.findUnique({
      where: { username: followingUsername },
    });

    if (!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
    };

    const follows = await this.prisma.follows.findFirst({
      where: { followerId: id, followingId: _profile.id },
    });

    if (id) {
      profile.following = !!follows;
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

    const followingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    const followerUser = await this.prisma.user.findUnique({
      where: { email: followerEmail },
    });

    if (followingUser.email === followerEmail) {
      throw new HttpException(
        "FollowerEmail and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }

    const _follows = await this.prisma.follows.findFirst({
      where: { followerId: followerUser.id, followingId: followingUser.id },
    });

    if (!_follows) {
      await this.prisma.follows.create({
        data: {
          followerId: followerUser.id,
          followingId: followingUser.id,
        },
      });
    }

    let profile: ProfileData = {
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

    const followingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (followingUser.id === followerId) {
      throw new HttpException(
        "FollowerId and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }
    const followingId = followingUser.id;
    await this.prisma.follows.deleteMany({
      where: { followerId, followingId },
    });

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return { profile };
  }
}
