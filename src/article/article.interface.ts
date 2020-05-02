import { Comment, Article } from '@prisma/client'

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: Article;
}

export interface ArticlesRO {
  articles: Article[];
  articlesCount: number;
}

