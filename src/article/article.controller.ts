import { Get, Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

@Controller('article')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }
}