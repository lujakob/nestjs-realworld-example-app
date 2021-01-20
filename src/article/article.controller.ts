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
  CommentDataBodyDto,
  ArticlesRO,
  ArticleRO,
  CommentsRO,
  ArticleDataDto,
  CommentRO,
  CreateArticleBodyDto,
} from "./dto";
import { User } from "../user/user.decorator";

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiParamOptions,
  PickType,
} from "@nestjs/swagger";
import { CommentEntity } from "./comment.entity";

const SlugParams: ApiParamOptions = {
  type: PickType(ArticleDataDto, ["slug"]),
  description: "Article's slug",
  name: "slug",
};

@ApiBearerAuth()
@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "Get all articles", operationId: "GetAllArticles" })
  @ApiQuery({ name: "tag", description: "article tag name" })
  @ApiQuery({ name: "author", description: "article author name" })
  @ApiQuery({ name: "favorited", description: "article favorited author name" })
  @ApiResponse({
    type: ArticlesRO,
  })
  @Get()
  async findAll(@User("id") userId, @Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @ApiOperation({ summary: "Get article feed", operationId: "GetArticleFeed" })
  @ApiResponse({
    status: 200,
    description: "Return article feed.",
    type: ArticlesRO,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get("feed")
  async getFeed(
    @User("id") userId: number,
    @Query() query
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @ApiOperation({
    summary: "Get article by slug",
    operationId: "GetArticleBySlug",
  })
  @ApiResponse({
    type: ArticleRO,
  })
  @ApiParam(SlugParams)
  @Get(":slug")
  async findOne(@Param("slug") slug): Promise<ArticleRO> {
    const article = await this.articleService.findOne({ slug });
    return {
      article: this.articleService.ArticleEntity2ArticleData(article),
    };
  }

  @ApiOperation({
    summary: "Get article comments",
    operationId: "GetArticleComments",
  })
  @ApiResponse({
    type: CommentsRO,
  })
  @ApiParam(SlugParams)
  @Get(":slug/comments")
  async findComments(@Param("slug") slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: "Create article", operationId: "CreateArticle" })
  @ApiBody({
    type: CreateArticleBodyDto,
  })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully created.",
    type: ArticleRO,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post()
  async create(
    @User("id") userId: number,
    @Body("article") articleData: CreateArticleDto
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: "Update article", operationId: "UpdateArticle" })
  @ApiBody({
    type: CreateArticleBodyDto,
  })
  @ApiParam(SlugParams)
  @ApiResponse({
    status: 201,
    description: "The article has been successfully updated.",
    type: ArticleRO,
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

  @ApiOperation({ summary: "Delete article", operationId: "DeleteArticle" })
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
    type: CommentRO,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiParam(SlugParams)
  @ApiBody({
    type: CommentDataBodyDto,
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
  @ApiParam(SlugParams)
  @ApiParam({
    type: PickType(CommentEntity, ["id"]),
    name: "id",
    description: "Comment id of article",
  })
  @Delete(":slug/comments/:id")
  async deleteComment(@Param() params) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: "Favorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully favorited.",
    type: ArticleRO,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiParam(SlugParams)
  @Post(":slug/favorite")
  async favorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: "Unfavorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully unfavorited.",
    type: ArticleRO,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiParam(SlugParams)
  @Delete(":slug/favorite")
  async unFavorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.unFavorite(userId, slug);
  }
}
