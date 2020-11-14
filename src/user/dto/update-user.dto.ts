import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({description: 'email'})
  readonly username: string;
  @ApiProperty({description: 'email'})
  readonly email: string;
  @ApiProperty({description: 'email'})
  readonly bio: string;
  @ApiProperty({description: 'email'})
  readonly image: string;
}