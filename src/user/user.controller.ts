import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  CreateUserBodyDto,
  LoginUserBodyDto,
  UpdateUserBodyDto,
  UserRO,
} from "./dto";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { User } from "./user.decorator";
import { ValidationPipe } from "../shared/pipes/validation.pipe";

import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  PickType,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("auth")
// TODO: ApiResponse should write for every route
@ApiResponse({
  type: UserRO,
})
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user")
  @ApiOperation({
    summary: "Get Current User",
    operationId: "GetCurrentUser",
  })
  async findMe(@User("email") email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put("user")
  @ApiBody({
    type: UpdateUserBodyDto,
  })
  @ApiOperation({
    summary: "Update Current User",
    operationId: "UpdateCurrentUser",
  })
  async update(
    @User("id") userId: number,
    @Body("user") userData: UpdateUserDto
  ) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post("users")
  @ApiBody({
    type: CreateUserBodyDto,
  })
  @ApiOperation({
    summary: "Register User",
    operationId: "Register",
  })
  async create(@Body("user") userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete("users/:slug")
  @ApiParam({
    type: PickType(CreateUserDto, ["email"]),
    name: "slug",
    description: "email of the user",
  })
  @ApiOperation({
    summary: "Delete User By Email",
    operationId: "DeleteUserByEmail",
  })
  async delete(@Param("slug") params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post("users/login")
  @ApiBody({
    type: LoginUserBodyDto,
  })
  @ApiOperation({
    summary: "Login User",
    operationId: "Login",
  })
  async login(@Body("user") loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: " not found" };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { email, username, bio, image } = _user;
    const user = { email, token, username, bio, image };
    return { user };
  }
}
