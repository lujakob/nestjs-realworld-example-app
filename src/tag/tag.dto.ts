import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
  @ApiProperty()
  tag: string;
}

export class TagsRO {
  @ApiProperty()
  tags: CreateTagDto[];
}
