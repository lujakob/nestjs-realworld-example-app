import { ArticleEntity } from "./article.entity";
import { UserDataDto } from "../user/dto";
interface Comment {
  body: string;
}

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserDataDto;
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: ArticleEntity;
}

export interface ArticlesRO {
  articles: ArticleEntity[];
  articlesCount: number;
}
