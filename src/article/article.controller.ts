import { Get, Post, Body, Put, Delete, Query, Param, Controller, Headers } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './article.dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { BaseController } from '../shared/base.controller';

@Controller('articles')
export class ArticleController extends BaseController{

  constructor(private readonly articleService: ArticleService) {
    super();
  }

  @Get()
  findAll(@Query() query): Promise<ArticlesRO> {
    return this.articleService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug): Promise<ArticleRO> {
    return this.articleService.findOne({slug});
  }

  @Get(':slug/comments')
  findComments(@Param('slug') slug): Promise<CommentsRO> {
    return this.articleService.findComments(slug);
  }

  @Post()
  async create(@Headers('authorization') authorization: string, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(this.getUserIdFromToken(authorization), articleData);
  }

  @Put(':slug')
  async update(@Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return await this.articleService.addComment(slug, commentData);
  }

  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @Post(':slug/favorite')
  async favorite(@Headers('authorization') authorization: string, @Param('slug') slug) {
    return await this.articleService.favorite(this.getUserIdFromToken(authorization), slug);
  }

  @Delete(':slug/favorite')
  async unFavorite(@Headers('authorization') authorization: string, @Param('slug') slug) {
    return await this.articleService.unFavorite(this.getUserIdFromToken(authorization), slug);
  }

  @Get('feed')
  getFeed(@Headers('authorization') authorization: string): Promise<ArticlesRO> {
    return this.articleService.findFeed(this.getUserIdFromToken(authorization));
  }

}