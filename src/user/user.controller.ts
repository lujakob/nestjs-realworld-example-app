import {Get, Post, Body, Put, Delete, Headers, Param, Controller, Req} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './user.dto';
import { HttpException } from '@nestjs/core';
import * as crypto from 'crypto';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@Req() {authUserId}: Request): Promise<User> {
    return await this.userService.findById(authUserId);
  }

  @Put('user')
  async update(@Req() {authUserId}: Request, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(authUserId, userData);
  }

  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @Post('users/login')
  async login(@Body('user') userLoginData: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(
      {
        email: userLoginData.email,
        password: crypto.createHmac('sha256', userLoginData.password).digest('hex'),
      }
    );

    if (!_user) throw new HttpException('User not found.', 401);

    const token = await this.userService.generateJWT(_user);
    const {email, username, bio, image} = _user;
    const user = {email, token, username, bio, image};
    return {user}
  }
}