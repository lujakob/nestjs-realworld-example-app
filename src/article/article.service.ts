import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, DeleteResult } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "../user/user.entity";
import {
  CreateArticleDto,
  ArticlesRO,
  ArticleDataDto,
  ArticleRO,
  CommentsRO,
} from "./dto";
import { ProfileDataDto } from "../profile/profile.dto";
import { UserDataDto } from "../user/dto";

const slug = require("slug");

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(query): Promise<ArticlesRO> {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.author", "author");

    qb.where("1 = 1");

    if ("tag" in query) {
      qb.andWhere("article.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ("author" in query) {
      const author =
        (await this.userRepository.findOne({
          username: query.author,
        })) || ({} as UserEntity);
      qb.andWhere("article.authorId = :id", { id: author.id });
    }

    if ("favorited" in query) {
      const author =
        (await this.userRepository.findOne({
          username: query.favorited,
        })) || ({} as UserEntity);
      const { favorites = [] } = author;
      const ids = favorites.map((el) => el.id);
      qb.andWhere("article.authorId IN (:ids)", { ids: ids.toString() });
    }

    qb.orderBy("article.createdAt", "DESC");

    const articlesCount = await qb.getCount();

    if ("limit" in query) {
      qb.limit(query.limit);
    }

    if ("offset" in query) {
      qb.offset(query.offset);
    }

    const _articles = await qb.getMany();

    const articles = _articles.map(this.ArticleEntity2ArticleData);

    return { articles, articlesCount };
  }

  async findFeed(userId: number, query): Promise<ArticlesRO> {
    const user = await this.userRepository.findOne({ id: userId });

    const _follows: UserEntity[] = user.following;

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.id);

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .where("article.authorId IN (:ids)", { ids });

    qb.orderBy("article.createdAt", "DESC");

    const articlesCount = await qb.getCount();

    if ("limit" in query) {
      qb.limit(query.limit);
    }

    if ("offset" in query) {
      qb.offset(query.offset);
    }

    const _articles = await qb.getMany();

    const articles = _articles.map(this.ArticleEntity2ArticleData);

    return { articles, articlesCount };
  }

  async findOne(where): Promise<ArticleEntity> {
    const _article = await getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.author", "author")
      .where("slug = :slug", where)
      .getOne();
    return _article;
  }

  async addComment(slug: string, commentData): Promise<unknown> {
    let _article = await this.articleRepository.findOne({ slug });

    const comment = new CommentEntity();
    comment.body = commentData.body;

    _article.comments.push(comment);

    const { id } = await this.commentRepository.save(comment);
    await this.articleRepository.save(_article);

    const _comment = await this.commentRepository.findOne(
      { id },
      {
        loadEagerRelations: true,
      }
    );

    return { comment: _comment };
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let _article = await this.articleRepository.findOne({ slug });

    const comment = await this.commentRepository.findOne(id);
    const deleteIndex = _article.comments.findIndex(
      (_comment) => _comment.id === comment.id
    );

    if (deleteIndex >= 0) {
      const deleteComments = _article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      _article = await this.articleRepository.save(_article);
      return { article: this.ArticleEntity2ArticleData(_article) };
    } else {
      return { article: this.ArticleEntity2ArticleData(_article) };
    }
  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let _article = await this.findOne({ slug });
    const author: UserEntity = _article.author;
    delete _article.author;
    const user = await this.userRepository.findOne(id, {
      loadEagerRelations: true,
    });

    const isNewFavorite =
      user.favorites.findIndex((_article) => _article.id === _article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(_article);
      _article.favoritesCount++;

      await this.userRepository.save(user);
      _article = await this.articleRepository.save(_article);
    }

    _article.author = author;

    return { article: this.ArticleEntity2ArticleData(_article) };
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let _article = await this.findOne({ slug });
    const author: UserEntity = _article.author;
    delete _article.author;
    const user = await this.userRepository.findOne(id, {
      loadEagerRelations: true,
    });

    const deleteIndex = user.favorites.findIndex(
      (_article) => _article.id === _article.id
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      _article.favoritesCount--;

      await this.userRepository.save(user);
      _article = await this.articleRepository.save(_article);
    }

    _article.author = author;

    return { article: this.ArticleEntity2ArticleData(_article) };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({ slug });
    return { comments: article.comments };
  }

  async create(
    userId: number,
    articleData: CreateArticleDto
  ): Promise<ArticleRO> {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles.push(article);

    await this.userRepository.save(author);

    newArticle.author = author;

    return { article: this.ArticleEntity2ArticleData(newArticle) };
  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.findOne({ slug: slug });
    const author: UserEntity = toUpdate.author;
    delete toUpdate.author;
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    article.author = author;
    return { article: this.ArticleEntity2ArticleData(article) };
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug: slug });
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  ArticleEntity2ArticleData(_article: ArticleEntity): ArticleDataDto {
    const _author = _article.author || ({} as UserDataDto);
    const profile: ProfileDataDto = {
      username: _author.username,
      image: _author.image,
      bio: _author.bio,
      // TODO: following is wrong
      following: false,
    };
    const article: ArticleDataDto = {
      favorited: !!_article.favoritesCount,
      favoritesCount: _article.favoritesCount,
      slug: _article.slug,
      title: _article.title,
      tagList: _article.tagList,
      description: _article.description,
      body: _article.body,
      createdAt: _article.createdAt,
      updatedAt: _article.updatedAt,
      author: profile,
    };

    return article;
  }
}
