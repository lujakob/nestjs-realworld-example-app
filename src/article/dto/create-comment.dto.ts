import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty()
  readonly body: string;
}

export class CommentsRO {
  @ApiProperty()
  comments: CreateCommentDto[];
}

export class CommentRO {
  @ApiProperty()
  comment: CreateCommentDto;
}
