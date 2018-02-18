import {Component, HttpStatus, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO } from './profile.interface';
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

  async follow(followerId: number, username: string): Promise<ProfileRO> {
    const followingUser = await this.userRepository.findOne({username});
    delete followingUser.password;

    if (followingUser.id === followerId) {
      throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }

    const follows = new Follows();
    follows.followerId = followerId;
    follows.followingId = followingUser.id;
    await this.followsRepository.save(follows);

    const profileRO = Object.assign({}, followingUser, {following: true});
    return {profile: profileRO};
  }

  async unFollow(followerId: number, username: string): Promise<ProfileRO> {
    const followingUser = await this.userRepository.findOne({username});
    delete followingUser.password;

    if (followingUser.id === followerId) {
      throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }
    const followingId = followingUser.id;
    await this.followsRepository.delete({followerId, followingId});

    const profileRO = Object.assign({}, followingUser, {following: false});
    return {profile: profileRO};
  }

}