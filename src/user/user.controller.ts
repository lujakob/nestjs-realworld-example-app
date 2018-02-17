import { Get, Post, Body, Put, Delete, Param, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

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
}