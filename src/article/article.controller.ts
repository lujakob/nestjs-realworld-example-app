import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.'})
  @Get()
  findAll(@Query() query): Promise<ArticlesRO> {
    return this.articleService.findAll(query);
  }


  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  getFeed(@User('id') userId: number, @Query() query): Promise<ArticlesRO> {
    return this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug): Promise<ArticleRO> {
    return this.articleService.findOne({slug});
  }

  @Get(':slug/comments')
  findComments(@Param('slug') slug): Promise<CommentsRO> {
    return this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@User('id') userId: number, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  update(@Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  favorite(@User('id') userId: number, @Param('slug') slug) {
    return this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return this.articleService.unFavorite(userId, slug);
  }

}
