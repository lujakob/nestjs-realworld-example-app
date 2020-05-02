import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto';
import { PrismaService } from '../shared/services/prisma.service';
const slug = require('slug');
import { ArticleWhereInput, Enumerable } from '@prisma/client'

const articleAuthorSelect = {
  email: true,
  username: true,
  bio: true,
  image: true
};

const commentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  body: true,
  author: { select: articleAuthorSelect }
};

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async findAll(query): Promise<any> {
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

  async addComment(userId: number, slug: string, {body}): Promise<any> {
    const comment = await this.prisma.comment.create({
      data: {
        body,
        article: {
          connect: { slug }
        },
        author: {
          connect: { id: userId }
        }
      },
      select: commentSelect
    });

    return { comment };
  }

  async deleteComment(slug: string, id: string): Promise<any> {
    // @Todo: no clue why API specs require a slug if the comment id is unique?!
    await this.prisma.comment.delete({ where: { id: +id }});
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

  async findComments(slug: string): Promise<any> {
    const comments = await this.prisma.comment.findMany({
      where: { article: { slug } },
      orderBy: { createdAt: 'desc' },
      select: commentSelect
    });
    return { comments };
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
