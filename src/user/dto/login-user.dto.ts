import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  
  @ApiProperty({description: 'email'})
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({description: 'password'})
  @IsNotEmpty()
  readonly password: string;
}