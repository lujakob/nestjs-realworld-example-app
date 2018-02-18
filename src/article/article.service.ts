import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import {CreateArticleDto} from "./create-article.dto";
import {UserService} from "../user/user.service";
const slug = require('slug');

@Component()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userService: UserService
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<Article> {
    const author = await this.userService.findById(userId);
    let article = new Article();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.author = author;

    return await this.articleRepository.save(article);
  }

  async update(slug: string, articleData: any): Promise<Article> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, articleData);
    return await this.articleRepository.save(updated);
  }

  async delete(slug: string): Promise<void> {
    return await this.articleRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}