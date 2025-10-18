import { UserData } from "../user/user.interface";

interface Comment {
  id?: number;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: number;
  articleId?: number;
}

interface ArticleData {
  id?: number;
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string;
  createdAt?: Date;
  updatedAt?: Date;
  favoriteCount?: number;
  authorId?: number;
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserData;
  comments?: Comment[];
  favoritedBy?: UserData[];
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: ArticleData;
}

export interface ArticlesRO {
  articles: ArticleData[];
  articlesCount: number;
}
