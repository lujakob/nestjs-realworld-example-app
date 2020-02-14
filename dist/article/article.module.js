"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const article_controller_1 = require("./article.controller");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("./article.entity");
const comment_entity_1 = require("./comment.entity");
const user_entity_1 = require("../user/user.entity");
const follows_entity_1 = require("../profile/follows.entity");
const article_service_1 = require("./article.service");
const auth_middleware_1 = require("../user/auth.middleware");
const user_module_1 = require("../user/user.module");
let ArticleModule = class ArticleModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: 'articles/feed', method: common_1.RequestMethod.GET }, { path: 'articles', method: common_1.RequestMethod.POST }, { path: 'articles/:slug', method: common_1.RequestMethod.DELETE }, { path: 'articles/:slug', method: common_1.RequestMethod.PUT }, { path: 'articles/:slug/comments', method: common_1.RequestMethod.POST }, { path: 'articles/:slug/comments/:id', method: common_1.RequestMethod.DELETE }, { path: 'articles/:slug/favorite', method: common_1.RequestMethod.POST }, { path: 'articles/:slug/favorite', method: common_1.RequestMethod.DELETE });
    }
};
ArticleModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([article_entity_1.ArticleEntity, comment_entity_1.Comment, user_entity_1.UserEntity, follows_entity_1.FollowsEntity]), user_module_1.UserModule],
        providers: [article_service_1.ArticleService],
        controllers: [
            article_controller_1.ArticleController
        ]
    })
], ArticleModule);
exports.ArticleModule = ArticleModule;
//# sourceMappingURL=article.module.js.map