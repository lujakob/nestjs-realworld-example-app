import { Get, Post, Body, Put, Delete, Query, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto, FindQueryDto } from './dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags, ApiParam, ApiBody, ApiQuery,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { ArticleEntity } from './article.entity';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) { }

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @ApiQuery({ type: FindQueryDto })
  @Get()
  async findAll(@Query() query: FindQueryDto): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }


  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ type: FindQueryDto })
  @Get('feed')
  async getFeed(@User('id') userId: number, @Query() query: FindQueryDto): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @ApiParam({ name: 'slug', type: 'string' })
  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({ slug });
  }

  @ApiParam({ name: 'slug', type: 'string' })
  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateArticleDto })
  @Post()
  async create(@User('id') userId: number, @Body() articleData: CreateArticleDto):  Promise<ArticleEntity> {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'slug', type: 'string' })
  @ApiBody({ type: CreateArticleDto })
  @Put(':slug')
  async update(@Param() params, @Body() articleData: CreateArticleDto): Promise<ArticleRO> {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'slug', type: 'string' })
  @Delete(':slug')
  async delete(@Param() params): Promise<DeleteResult> {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'slug', type: 'string' })
  @ApiBody({ type: CreateCommentDto })
  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body() commentData: CreateCommentDto): Promise<ArticleRO> {
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'slug' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params): Promise<ArticleRO> {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully favorited.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'slug', type: 'string' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'slug', type: 'string' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.unFavorite(userId, slug);
  }

}