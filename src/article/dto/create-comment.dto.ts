import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { ProfileDataDto } from "../../profile/profile.dto";

class CommentExtraDataDto {
  @ApiProperty()
  id: Number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  author: ProfileDataDto;
}

export class CreateCommentDto {
  @ApiProperty()
  readonly body: string;
}

export class CommentDataDto extends IntersectionType(
  CreateCommentDto,
  CommentExtraDataDto
) {}

export class CommentDataBodyDto {
  @ApiProperty()
  comment: CreateCommentDto;
}

export class CommentsRO {
  @ApiProperty({
    isArray: true,
    type: CommentDataDto,
  })
  comments: CommentDataDto[];
}

export class CommentRO {
  @ApiProperty()
  comment: CommentDataDto;
}
