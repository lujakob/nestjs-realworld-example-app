import {Component, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO, ProfileData } from './profile.interface';
import {FollowsEntity} from "./follows.entity";
import {HttpException} from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<UserEntity>): Promise<ProfileRO> {
    const user = await this.userRepository.findOne(options);
    delete user.id;
    if (user) delete user.password;
    return {profile: user};
  }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne( {username: followingUsername});

    if(!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image
    };

    const follows = await this.followsRepository.findOne( {followerId: id, followingId: _profile.id});

    if (id) {
      profile.following = !!follows;
    }

    return {profile};
  }

  async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException('Follower email and username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({username});
    const followerUser = await this.userRepository.findOne({email: followerEmail});

    if (followingUser.email === followerEmail) {
      throw new HttpException('FollowerEmail and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }

    const _follows = await this.followsRepository.findOne( {followerId: followerUser.id, followingId: followingUser.id});

    if (!_follows) {
      const follows = new FollowsEntity();
      follows.followerId = followerUser.id;
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
    }

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true
    };

    return {profile};
  }

  async unFollow(followerId: number, username: string): Promise<ProfileRO> {
    if (!followerId || !username) {
      throw new HttpException('FollowerId and username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({username});

    if (followingUser.id === followerId) {
      throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }
    const followingId = followingUser.id;
    await this.followsRepository.delete({followerId, followingId});

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false
    };

    return {profile};
  }

}
