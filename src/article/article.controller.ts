import {Get, Post, Body, Put, Delete, Param, Controller, Headers} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto, CreateCommentDto } from './article.dto';
import { SECRET } from "../config";
import * as jwt from 'jsonwebtoken';
import {CommentsRO} from "./article.interface";

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':slug/comments')
  findComments(@Param('slug') slug): Promise<CommentsRO> {
    return this.articleService.findComments(slug);
  }

  @Post()
  async create(@Headers('authorization') authorization: string, @Body('article') articleData: CreateArticleDto) {
    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, SECRET);
    return this.articleService.create(decoded.id, articleData);
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

  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return await this.articleService.addComment(slug, commentData);
  }

  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.articleService.deleteComment(slug, id);
  }

}