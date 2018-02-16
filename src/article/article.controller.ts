import { Get, Post, Body, Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './create-article.dto';

@Controller('article')
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
    article.slug = articleData.title;

    return this.articleService.create(article);
  }
}