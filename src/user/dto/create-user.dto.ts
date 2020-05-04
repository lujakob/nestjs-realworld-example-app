import { IsNotEmpty, IsEmail, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// source class
export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @MaxLength(16)
  @MinLength(6)
  @ApiProperty()
  readonly password: string;
}

export class CreateUserBodyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: CreateUserDto;
}
