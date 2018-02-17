import { Get, Post, Body, Put, Delete, UseGuards, Param, Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './create-article.dto';
import { RolesGuard } from '../user/roles.guard';
const slug = require('slug');

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Post()
  async create(@Body() articleData: CreateArticleDto) {

    let article = new Article();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);

    return this.articleService.create(article);
  }

  @Put(':slug')
  async update(@Param() params, @Body() articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}