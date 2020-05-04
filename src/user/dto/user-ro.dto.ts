import { UpdateUserDto } from "./update-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserDataDto extends UpdateUserDto {
  @ApiProperty()
  token: string;
}

export class UserRO {
  @ApiProperty()
  user: UserDataDto;
}
