import { Get, Post, Body, Put, Delete, Headers, Param, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './user.dto';
import { HttpException } from '@nestjs/core';
import * as crypto from 'crypto';
import { BaseController } from '../shared/base.controller';

@Controller()
export class UserController extends BaseController {

  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('user')
  async findMe(@Headers('authorization') authorization: string): Promise<User> {
    return await this.userService.findById(this.getUserIdFromToken(authorization));
  }

  @Put('user')
  async update(@Headers('authorization') authorization: string, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(this.getUserIdFromToken(authorization), userData);
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