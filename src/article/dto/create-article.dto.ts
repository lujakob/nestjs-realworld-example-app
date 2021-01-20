import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateArticleDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly body: string;

  @ApiProperty()
  readonly tagList: string[];

  @ApiPropertyOptional()
  readonly createdAt?: Date;

  @ApiPropertyOptional()
  readonly updatedAt?: Date;
}

export class CreateArticleBodyDto {
  @ApiProperty()
  article: CreateArticleDto;
}
