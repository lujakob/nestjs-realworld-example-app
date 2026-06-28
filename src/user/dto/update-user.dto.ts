import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly username: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  readonly bio: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  readonly image: string;
}
