import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { CreateArticleDto } from "./create-article.dto";
import { ProfileDataDto } from "../../profile/profile.dto";

class ArticleExtraDataDto {
  @ApiProperty()
  favorited: Boolean;

  @ApiProperty()
  favoritesCount: Number;

  @ApiProperty()
  author: ProfileDataDto;

  @ApiProperty()
  slug: string;
}

export class ArticleDataDto extends IntersectionType(
  CreateArticleDto,
  ArticleExtraDataDto
) {}

export class ArticleRO {
  @ApiProperty()
  article: ArticleDataDto;
}

export class ArticlesRO {
  @ApiProperty({ isArray: true, type: ArticleDataDto })
  articles: ArticleDataDto[];

  @ApiProperty()
  articlesCount: number;
}
