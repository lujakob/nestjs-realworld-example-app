import { Get, Post, Body, Put, Delete, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './user.dto';
import { HttpException } from '@nestjs/core';
import * as crypto from 'crypto';
import { User } from './user.decorator';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('id') userId: number): Promise<UserEntity> {
    return await this.userService.findById(userId);
  }

  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
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