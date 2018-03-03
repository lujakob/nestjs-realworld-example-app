import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/core';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

import {
  ApiUseTags,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('user')
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

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    console.log("loginUserDto", loginUserDto);
    const _user = await this.userService.findOne(loginUserDto);

    if (!_user) throw new HttpException('User not found.', 401);

    const token = await this.userService.generateJWT(_user);
    const {email, username, bio, image} = _user;
    const user = {email, token, username, bio, image};
    return {user}
  }
}