import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserRO } from './user.interface';
import {DeepPartial} from 'typeorm/common/DeepPartial';

@Component()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async create(userData: CreateUserDto): Promise<UserRO> {

    let user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.password = userData.password;

    const savedUser = await this.userRepository.save(user);
    const userRO = {
      username: savedUser.username,
      email: savedUser.email,
      bio: savedUser.bio,
      token: this.generateJWT(savedUser),
      image: null
    };

    return {user: userRO};
  }

  async update(email: string, userData: any): Promise<User> {
    let toUpdate = await this.userRepository.findOne({ email: email});
    let updated = Object.assign(toUpdate, userData);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<void> {
    return await this.userRepository.delete({ email: email});
  }

  async findByEmail(email: string): Promise<User>{
    const user = await this.userRepository.findOne( { email: email});
    if (user) delete user.password;
    return user;
  }


  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };
}