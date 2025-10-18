"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const common_1 = require("@nestjs/common");
const article_service_1 = require("./article.service");
const dto_1 = require("./dto");
const user_decorator_1 = require("../user/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ArticleController = class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    findAll(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findAll(query, userId);
        });
    }
    getFeed(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findFeed(userId, query);
        });
    }
    findOne(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findOne({ slug });
        });
    }
    findComments(slug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findComments(slug, userId);
        });
    }
    create(userId, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleService.create(userId, articleData);
        });
    }
    update(params, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleService.update(params.slug, articleData);
        });
    }
    delete(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleService.delete(params.slug);
        });
    }
    createComment(slug, commentData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.addComment(slug, commentData, userId);
        });
    }
    deleteComment(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug, id } = params;
            return yield this.articleService.deleteComment(slug, id);
        });
    }
    favorite(userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.favorite(userId, slug);
        });
    }
    unFavorite(userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.unFavorite(userId, slug);
        });
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all articles" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Return all articles." }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get article feed" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Return article feed." }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Get)("feed"),
    __param(0, (0, user_decorator_1.User)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)(":slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":slug/comments"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, user_decorator_1.User)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create article" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.User)("id")),
    __param(1, (0, common_1.Body)("article")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update article" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Put)(":slug"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)("article")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete article" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Delete)(":slug"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create comment" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The comment has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Post)(":slug/comments"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Body)("comment")),
    __param(2, (0, user_decorator_1.User)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateCommentDto, Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createComment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete comment" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Delete)(":slug/comments/:id"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteComment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Favorite article" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully favorited.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Post)(":slug/favorite"),
    __param(0, (0, user_decorator_1.User)("id")),
    __param(1, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "favorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Unfavorite article" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The article has been successfully unfavorited.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, common_1.Delete)(":slug/favorite"),
    __param(0, (0, user_decorator_1.User)("id")),
    __param(1, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "unFavorite", null);
ArticleController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("articles"),
    (0, common_1.Controller)("articles"),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.controller.js.map