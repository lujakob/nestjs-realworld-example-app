import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateArticleDto } from "./dto";

import { ArticleRO, ArticlesRO, CommentsRO } from "./article.interface";
const slug = require("slug");

@Injectable()
export class ArticleService {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(query): Promise<ArticlesRO> {
    let where: any = {};

    if ("tag" in query) {
      where.tagList = {
        contains: query.tag,
      };
    }

    if ("author" in query) {
      const author = await this.prisma.user.findUnique({
        where: { username: query.author },
      });
      if (author) {
        where.authorId = author.id;
      }
    }

    if ("favorited" in query) {
      const user = await this.prisma.user.findUnique({
        where: { username: query.favorited },
        include: { favorites: true },
      });
      if (user) {
        const ids = user.favorites.map((el) => el.id);
        where.id = { in: ids };
      }
    }

    const articlesCount = await this.prisma.article.count({ where });

    const articles = await this.prisma.article.findMany({
      where,
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
      orderBy: { createdAt: "desc" },
      take: query.limit ? parseInt(query.limit) : undefined,
      skip: query.offset ? parseInt(query.offset) : undefined,
    });

    return { articles, articlesCount };
  }

  async findFeed(userId: number, query): Promise<ArticlesRO> {
    const _follows = await this.prisma.follows.findMany({
      where: { followerId: userId },
    });

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.followingId);

    const where = { authorId: { in: ids } };

    const articlesCount = await this.prisma.article.count({ where });

    const articles = await this.prisma.article.findMany({
      where,
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
      orderBy: { createdAt: "desc" },
      take: query.limit ? parseInt(query.limit) : undefined,
      skip: query.offset ? parseInt(query.offset) : undefined,
    });

    return { articles, articlesCount };
  }

  async findOne(where): Promise<ArticleRO> {
    const article = await this.prisma.article.findFirst({
      where,
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });
    return { article };
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    const comment = await this.prisma.comment.create({
      data: {
        body: commentData.body,
        articleId: article.id,
        authorId: commentData.authorId,
      },
    });

    const updatedArticle = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });

    return { article: updatedArticle };
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    await this.prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    const updatedArticle = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });

    return { article: updatedArticle };
  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { favorites: true },
    });

    const isNewFavorite = !user.favorites.find(
      (_article) => _article.id === article.id
    );
    if (isNewFavorite) {
      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          favoriteCount: { increment: 1 },
          favoritedBy: {
            connect: { id: user.id },
          },
        },
      });
    }

    const updatedArticle = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });

    return { article: updatedArticle };
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { favorites: true },
    });

    const isFavorite = user.favorites.find(
      (_article) => _article.id === article.id
    );
    if (isFavorite) {
      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          favoriteCount: { decrement: 1 },
          favoritedBy: {
            disconnect: { id: user.id },
          },
        },
      });
    }

    const updatedArticle = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });

    return { article: updatedArticle };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: { comments: true },
    });
    return { comments: article.comments };
  }

  async create(userId: number, articleData: CreateArticleDto) {
    const newArticle = await this.prisma.article.create({
      data: {
        title: articleData.title,
        description: articleData.description,
        body: articleData.body || "",
        slug: this.slugify(articleData.title),
        tagList: JSON.stringify(articleData.tagList || []),
        authorId: userId,
        favoriteCount: 0,
      },
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });

    return newArticle;
  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    const article = await this.prisma.article.update({
      where: { slug },
      data: articleData,
      include: {
        author: true,
        comments: true,
        favoritedBy: true,
      },
    });
    return { article };
  }

  async delete(slug: string) {
    return await this.prisma.article.delete({ where: { slug } });
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
