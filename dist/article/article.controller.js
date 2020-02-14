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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const article_service_1 = require("./article.service");
const dto_1 = require("./dto");
const user_decorator_1 = require("../user/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ArticleController = class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findAll(query);
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
    findComments(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.findComments(slug);
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
    createComment(slug, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleService.addComment(slug, commentData);
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
    swagger_1.ApiOperation({ title: 'Get all articles' }),
    swagger_1.ApiResponse({ status: 200, description: 'Return all articles.' }),
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Get article feed' }),
    swagger_1.ApiResponse({ status: 200, description: 'Return article feed.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Get('feed'),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getFeed", null);
__decorate([
    common_1.Get(':slug'),
    __param(0, common_1.Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findOne", null);
__decorate([
    common_1.Get(':slug/comments'),
    __param(0, common_1.Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findComments", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Create article' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully created.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Post(),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Body('article')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Update article' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully updated.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Put(':slug'),
    __param(0, common_1.Param()), __param(1, common_1.Body('article')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "update", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Delete article' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully deleted.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Delete(':slug'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "delete", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Create comment' }),
    swagger_1.ApiResponse({ status: 201, description: 'The comment has been successfully created.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Post(':slug/comments'),
    __param(0, common_1.Param('slug')), __param(1, common_1.Body('comment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createComment", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Delete comment' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully deleted.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Delete(':slug/comments/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteComment", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Favorite article' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully favorited.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Post(':slug/favorite'),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "favorite", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Unfavorite article' }),
    swagger_1.ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Delete(':slug/favorite'),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "unFavorite", null);
ArticleController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiUseTags('articles'),
    common_1.Controller('articles'),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.controller.js.map