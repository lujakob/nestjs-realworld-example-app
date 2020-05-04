import {
  ApiPropertyOptional,
  PartialType,
  OmitType,
  ApiProperty,
} from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"])
) {
  @ApiPropertyOptional()
  readonly bio: string;

  @ApiPropertyOptional()
  readonly image?: string;
}

export class UpdateUserBodyDto {
  @IsNotEmpty()
  @ApiProperty()
  user: UpdateUserDto;
}
