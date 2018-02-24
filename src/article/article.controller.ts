import {Get, Post, Body, Put, Delete, Query, Param, Controller, Req} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './article.dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { BaseController } from '../shared/base.controller';

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({slug});
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @Post()
  async create(@Req() {authUserId}: Request, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(authUserId, articleData);
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
  async favorite(@Req() {authUserId}: Request, @Param('slug') slug) {
    return await this.articleService.favorite(authUserId, slug);
  }

  @Delete(':slug/favorite')
  async unFavorite(@Req() {authUserId}: Request, @Param('slug') slug) {
    return await this.articleService.unFavorite(authUserId, slug);
  }

  @Get('feed')
  async getFeed(@Query() query, @Req() {authUserId}: Request,): Promise<ArticlesRO> {
    return await this.articleService.findFeed(authUserId, query);
  }

}