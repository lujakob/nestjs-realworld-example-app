import {Component, HttpStatus, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO, ProfileData } from './profile.interface';
import {Follows} from "./follows.entity";
import {HttpException} from "@nestjs/core";

@Component()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<User>): Promise<ProfileRO> {
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

  async follow(followerId: number, username: string): Promise<ProfileRO> {
    const followingUser = await this.userRepository.findOne({username});

    if (followingUser.id === followerId) {
      throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }

    const _follows = await this.followsRepository.findOne( {followerId, followingId: followingUser.id});

    if (!_follows) {
      const follows = new Follows();
      follows.followerId = followerId;
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