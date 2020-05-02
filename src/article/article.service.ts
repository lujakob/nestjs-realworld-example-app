import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto';
import { PrismaService } from '../shared/services/prisma.service';
const slug = require('slug');
import { ArticleWhereInput, Enumerable } from '@prisma/client';

const articleAuthorSelect = {
  email: true,
  username: true,
  bio: true,
  image: true,
  followedBy: { select: { id: true } }
};

const commentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  body: true,
  author: { select: articleAuthorSelect }
};

const articleInclude = {
  author: { select: articleAuthorSelect },
  favoritedBy: { select: { id: true }},
};

// map dynamic value "following" (is the current user following this author)
const mapAuthorFollowing = (userId, {followedBy, ...rest}) => ({
  ...rest,
  following: Array.isArray(followedBy) && followedBy.map(f => f.id).includes(userId),
});

// map dynamic values "following" and "favorited" (from favoritedBy)
const mapDynamicValues = (userId, {favoritedBy, author, ...rest}) => ({
  ...rest,
  favorited: Array.isArray(favoritedBy) && favoritedBy.map(f => f.id).includes(userId),
  author: mapAuthorFollowing(userId, author),
});

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, query): Promise<any> {
    const andQueries = this.buildFindAllQuery(query);
    let articles = await this.prisma.article.findMany({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
      include: articleInclude,
      ...('limit' in query ? {first: +query.limit} : {}),
      ...('offset' in query ? {skip: +query.offset} : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
    });

    articles = (articles as any).map((a) => mapDynamicValues(userId, a));

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
    let articles = await this.prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: articleInclude,
      ...('limit' in query ? {first: +query.limit} : {}),
      ...('offset' in query ? {skip: +query.offset} : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where,
      orderBy: { createdAt: 'desc' },
    });

    articles = (articles as any).map((a) => mapDynamicValues(userId, a));

    return { articles, articlesCount };
  }

  async findOne(userId: number, slug: string): Promise<any> {
    let article: any = await this.prisma.article.findOne({
      where: { slug },
      include: articleInclude,
    });

    article = mapDynamicValues(userId, article);

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

  async favorite(userId: number, slug: string): Promise<any> {
    let article: any = await this.prisma.article.update(
      {
        where: { slug },
        data: {
          favoritedBy: {
            connect: { id: userId }
          }
        },
        include: articleInclude
      }
    );

    article = mapDynamicValues(userId, article);

    return { article };
  }

  async unFavorite(userId: number, slug: string): Promise<any> {
    let article: any = await this.prisma.article.update(
      {
        where: { slug },
        data: {
          favoritedBy: {
            disconnect: { id: userId }
          }
        },
        include: articleInclude
      }
    );

    article = mapDynamicValues(userId, article);

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
      tagList: payload.tagList.join(','),
      author: {
        connect: { id: userId }
      }
    };
    let article: any = await this.prisma.article.create({
      data,
      include: articleInclude
    });

    article = mapDynamicValues(userId, article);

    return { article };
  }

  async update(userId: number, slug: string, data: any): Promise<any> {
    let article: any = await this.prisma.article.update({
      where: { slug },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: articleInclude,
    });

    article = mapDynamicValues(userId, article);

    return { article };
  }

  async delete(slug: string): Promise<void> {
    await this.prisma.article.delete({ where: { slug } });
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
