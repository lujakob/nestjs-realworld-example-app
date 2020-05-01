import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto';

import {ArticleRO, ArticlesRO, CommentsRO} from './article.interface';
import { PrismaService } from '../shared/services/prisma.service';
const slug = require('slug');
import { ArticleWhereInput, Enumerable } from '@prisma/client'

const articleAuthorSelect = {
  email: true,
  username: true,
  bio: true,
  image: true
};

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async findAll(query): Promise<ArticlesRO> {
    const andQueries = this.buildFindAllQuery(query);
    const articles = await this.prisma.article.findMany({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: articleAuthorSelect } },
      ...('limit' in query ? {first: +query.limit} : {}),
      ...('offset' in query ? {skip: +query.offset} : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
    });

    return { articles, articlesCount };
  }

  private buildFindAllQuery(query): Enumerable<ArticleWhereInput> {
    const queries = [];

    if ('tag' in query) {
      queries.push({
        tagList: {
          contains: query.tag
        }
      });
    }

    if ('author' in query) {
      queries.push({
        author: {
          username: {
            equals: query.author
          }
        }
      });
    }

    if ('favorited' in query) {
      queries.push({
        favoritedBy: {
          some: {
            username: {
              equals: query.favorited
            }
          }
        }
      });
    }

    return queries;
  }

  async findFeed(userId: number, query): Promise<any> {
    const where = {
      author: {
        followedBy: { some: { id: +userId } }
      }
    };
    const articles = await this.prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: articleAuthorSelect } },
      ...('limit' in query ? {first: +query.limit} : {}),
      ...('offset' in query ? {skip: +query.offset} : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { articles, articlesCount };
  }

  async findOne(slug: string): Promise<any> {
    const article = await this.prisma.article.findOne({
      where: { slug },
      include: { author: { select: articleAuthorSelect } },
    });

    return { article };
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    return null;

    // let article = await this.articleRepository.findOne({slug});
    //
    // const comment = new Comment();
    // comment.body = commentData.body;
    //
    // article.comments.push(comment);
    //
    // await this.commentRepository.save(comment);
    // article = await this.articleRepository.save(article);
    // return {article}
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    return null;

    // let article = await this.articleRepository.findOne({slug});
    //
    // const comment = await this.commentRepository.findOne(id);
    // const deleteIndex = article.comments.findIndex(_comment => _comment.id === comment.id);
    //
    // if (deleteIndex >= 0) {
    //   const deleteComments = article.comments.splice(deleteIndex, 1);
    //   await this.commentRepository.delete(deleteComments[0].id);
    //   article =  await this.articleRepository.save(article);
    //   return {article};
    // } else {
    //   return {article};
    // }

  }

  async favorite(id: number, slug: string): Promise<any> {
    // @Todo: handle favoriteCount
    const article = await this.prisma.article.update(
      {
        where: { slug },
        data: {
          favoritedBy: {
            connect: { id }
          }
        },
        include: { author: { select: articleAuthorSelect } }
      }
    );
    return { article };
  }

  async unFavorite(id: number, slug: string): Promise<any> {
    // @Todo: handle favoriteCount
    const article = await this.prisma.article.update(
      {
        where: { slug },
        data: {
          favoritedBy: {
            disconnect: { id }
          }
        },
        include: { author: { select: articleAuthorSelect } }
      }
    );
    return { article };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    return null;

    // const article = await this.articleRepository.findOne({slug});
    // return {comments: article.comments};
  }

  async create(userId: number, payload: CreateArticleDto): Promise<any> {
    const data = {
      ...payload,
      slug: this.slugify(payload.title),
      // @Todo: handle favoriteCount
      favoriteCount: 0,
      tagList: payload.tagList.join(','),
      author: {
        connect: { id: userId }
      }
    };
    const article = await this.prisma.article.create({ data });

    return { article };
  }

  async update(slug: string, data: any): Promise<any> {
    const article = await this.prisma.article.update({
      where: { slug },
      data,
      include: { author: { select: articleAuthorSelect } },
    });
    return { article };
  }

  async delete(slug: string): Promise<void> {
    await this.prisma.article.delete({ where: { slug } });
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
