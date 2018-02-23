import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Follows } from '../profile/follows.entity';
import { CreateArticleDto } from './article.dto';

import {ArticleRO, ArticlesRO, CommentsRO} from './article.interface';
const slug = require('slug');

@Component()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>
  ) {}

  async findAll(query): Promise<ArticlesRO> {

console.log(query);
    const qb = await getRepository(Article)
      .createQueryBuilder('article');

    if ('tag' in query) {
      qb.where("article.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }


    const articles = await qb.getMany();

    // const articles = await this.articleRepository.find();
    return {articles};
  }

  async findFeed(userId: number): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});
    const ids = _follows.map(el => el.followingId);

    const articles = await getRepository(Article)
      .createQueryBuilder('article')
      .where('article.authorId IN (:ids)', { ids: ids })
      .getMany();

    return {articles};
  }

  async findOne(where): Promise<Article> {
    return await this.articleRepository.findOne(where);
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return {article}
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = await this.commentRepository.findOneById(id);
    const deleteIndex = article.comments.findIndex(_comment => _comment.id === comment.id);

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.deleteById(deleteComments[0].id);
      article =  await this.articleRepository.save(article);
      return {article};
    } else {
      return {article};
    }

  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOneById(id);

    const isNewFavorite = user.favorites.findIndex(_article => _article.id === article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOneById(id);

    const deleteIndex = user.favorites.findIndex(_article => _article.id === article.id);

    if (deleteIndex >= 0) {

      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({slug});
    return {comments: article.comments};
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<Article> {
    const author = await this.userRepository.findOneById(userId);
    let article = new Article();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];
    article.author = author;

    return await this.articleRepository.save(article);
  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return {article};
  }

  async delete(slug: string): Promise<void> {
    return await this.articleRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}