import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import {
  CreateArticleDto,
  CreateCommentDto,
  ArticlesRO,
  ArticleRO,
  CommentsRO,
} from "./dto";
import { User } from "../user/user.decorator";

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "Get all articles", operationId: "GetAllArticles" })
  @ApiResponse({
    status: 200,
    description: "Return all articles.",
    type: ArticlesRO,
  })
  @ApiQuery({ name: "tag", description: "article tag name" })
  @ApiQuery({ name: "author", description: "article author name" })
  @ApiQuery({ name: "favorited", description: "article favorited author name" })
  @Get()
  async findAll(@User("id") userId, @Query() query): Promise<unknown> {
    return await this.articleService.findAll(query);
  }

  @ApiOperation({ summary: "Get article feed" })
  @ApiResponse({ status: 200, description: "Return article feed." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get("feed")
  async getFeed(
    @User("id") userId: number,
    @Query() query
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(":slug")
  async findOne(@Param("slug") slug): Promise<ArticleRO> {
    const article = await this.articleService.findOne({ slug });
    return {
      article: this.articleService.ArticleEntity2ArticleData(article),
    };
  }

  @Get(":slug/comments")
  async findComments(@Param("slug") slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: "Create article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post()
  async create(
    @User("id") userId: number,
    @Body("article") articleData: CreateArticleDto
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: "Update article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Put(":slug")
  async update(
    @Param() params,
    @Body("article") articleData: CreateArticleDto
  ) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: "Delete article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug")
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: "Create comment", operationId: "CreateComment" })
  @ApiResponse({
    status: 201,
    description: "The comment has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CommentsRO,
  })
  @Post(":slug/comments")
  async createComment(
    @User("id") userId,
    @Param("slug") slug,
    @Body("comment") commentData: CreateCommentDto
  ) {
    return await this.articleService.addComment(userId, slug, commentData);
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/comments/:id")
  async deleteComment(@Param() params) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: "Favorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully favorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post(":slug/favorite")
  async favorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: "Unfavorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully unfavorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/favorite")
  async unFavorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.unFavorite(userId, slug);
  }
}
