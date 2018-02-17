import { Get, Post, Body, Put, Delete, Param, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './user.dto';
import {HttpException} from "@nestjs/core";
import * as crypto from "crypto";

@Controller('api/users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Put(':slug')
  async update(@Param() params, @Body() userData: CreateUserDto) {
    // Todo: update slug also when title gets changed
    return this.userService.update(params.slug, userData);
  }

  @Delete(':slug')
  async delete(@Param() params) {
    return this.userService.delete(params.slug);
  }

  @Post('login')
  async login(@Body('user') userLoginData: LoginUserDto): Promise<string> {
    const user = await this.userService.findOne(
      {
        email: userLoginData.email,
        password: crypto.createHmac('sha256', userLoginData.password).digest('hex'),
      }
    );
    
    if (!user) throw new HttpException('User not found.', 401);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return await this.userService.generateJWT(payload);
  }
}