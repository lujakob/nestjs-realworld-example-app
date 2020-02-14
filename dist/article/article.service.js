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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./article.entity");
const comment_entity_1 = require("./comment.entity");
const user_entity_1 = require("../user/user.entity");
const follows_entity_1 = require("../profile/follows.entity");
const slug = require('slug');
let ArticleService = class ArticleService {
    constructor(articleRepository, commentRepository, userRepository, followsRepository) {
        this.articleRepository = articleRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.followsRepository = followsRepository;
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = yield typeorm_2.getRepository(article_entity_1.ArticleEntity)
                .createQueryBuilder('article')
                .leftJoinAndSelect('article.author', 'author');
            qb.where("1 = 1");
            if ('tag' in query) {
                qb.andWhere("article.tagList LIKE :tag", { tag: `%${query.tag}%` });
            }
            if ('author' in query) {
                const author = yield this.userRepository.findOne({ username: query.author });
                qb.andWhere("article.authorId = :id", { id: author.id });
            }
            if ('favorited' in query) {
                const author = yield this.userRepository.findOne({ username: query.favorited });
                const ids = author.favorites.map(el => el.id);
                qb.andWhere("article.authorId IN (:ids)", { ids });
            }
            qb.orderBy('article.created', 'DESC');
            const articlesCount = yield qb.getCount();
            if ('limit' in query) {
                qb.limit(query.limit);
            }
            if ('offset' in query) {
                qb.offset(query.offset);
            }
            const articles = yield qb.getMany();
            return { articles, articlesCount };
        });
    }
    findFeed(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const _follows = yield this.followsRepository.find({ followerId: userId });
            if (!(Array.isArray(_follows) && _follows.length > 0)) {
                return { articles: [], articlesCount: 0 };
            }
            const ids = _follows.map(el => el.followingId);
            const qb = yield typeorm_2.getRepository(article_entity_1.ArticleEntity)
                .createQueryBuilder('article')
                .where('article.authorId IN (:ids)', { ids });
            qb.orderBy('article.created', 'DESC');
            const articlesCount = yield qb.getCount();
            if ('limit' in query) {
                qb.limit(query.limit);
            }
            if ('offset' in query) {
                qb.offset(query.offset);
            }
            const articles = yield qb.getMany();
            return { articles, articlesCount };
        });
    }
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findOne(where);
            return { article };
        });
    }
    addComment(slug, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.articleRepository.findOne({ slug });
            const comment = new comment_entity_1.Comment();
            comment.body = commentData.body;
            article.comments.push(comment);
            yield this.commentRepository.save(comment);
            article = yield this.articleRepository.save(article);
            return { article };
        });
    }
    deleteComment(slug, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.articleRepository.findOne({ slug });
            const comment = yield this.commentRepository.findOne(id);
            const deleteIndex = article.comments.findIndex(_comment => _comment.id === comment.id);
            if (deleteIndex >= 0) {
                const deleteComments = article.comments.splice(deleteIndex, 1);
                yield this.commentRepository.delete(deleteComments[0].id);
                article = yield this.articleRepository.save(article);
                return { article };
            }
            else {
                return { article };
            }
        });
    }
    favorite(id, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.articleRepository.findOne({ slug });
            const user = yield this.userRepository.findOne(id);
            const isNewFavorite = user.favorites.findIndex(_article => _article.id === article.id) < 0;
            if (isNewFavorite) {
                user.favorites.push(article);
                article.favoriteCount++;
                yield this.userRepository.save(user);
                article = yield this.articleRepository.save(article);
            }
            return { article };
        });
    }
    unFavorite(id, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = yield this.articleRepository.findOne({ slug });
            const user = yield this.userRepository.findOne(id);
            const deleteIndex = user.favorites.findIndex(_article => _article.id === article.id);
            if (deleteIndex >= 0) {
                user.favorites.splice(deleteIndex, 1);
                article.favoriteCount--;
                yield this.userRepository.save(user);
                article = yield this.articleRepository.save(article);
            }
            return { article };
        });
    }
    findComments(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findOne({ slug });
            return { comments: article.comments };
        });
    }
    create(userId, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            let article = new article_entity_1.ArticleEntity();
            article.title = articleData.title;
            article.description = articleData.description;
            article.slug = this.slugify(articleData.title);
            article.tagList = articleData.tagList || [];
            article.comments = [];
            const newArticle = yield this.articleRepository.save(article);
            const author = yield this.userRepository.findOne({ where: { id: userId } });
            if (Array.isArray(author.articles)) {
                author.articles.push(article);
            }
            else {
                author.articles = [article];
            }
            yield this.userRepository.save(author);
            return newArticle;
        });
    }
    update(slug, articleData) {
        return __awaiter(this, void 0, void 0, function* () {
            let toUpdate = yield this.articleRepository.findOne({ slug: slug });
            let updated = Object.assign(toUpdate, articleData);
            const article = yield this.articleRepository.save(updated);
            return { article };
        });
    }
    delete(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.articleRepository.delete({ slug: slug });
        });
    }
    slugify(title) {
        return slug(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }
};
ArticleService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(article_entity_1.ArticleEntity)),
    __param(1, typeorm_1.InjectRepository(comment_entity_1.Comment)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __param(3, typeorm_1.InjectRepository(follows_entity_1.FollowsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map