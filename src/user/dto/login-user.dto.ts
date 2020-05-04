import { OmitType, ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto extends OmitType(CreateUserDto, ["username"]) {}

export class LoginUserBodyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: LoginUserDto;
}
