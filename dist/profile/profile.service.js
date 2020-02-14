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
const user_entity_1 = require("../user/user.entity");
const follows_entity_1 = require("./follows.entity");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
let ProfileService = class ProfileService {
    constructor(userRepository, followsRepository) {
        this.userRepository = userRepository;
        this.followsRepository = followsRepository;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(options);
            delete user.id;
            if (user)
                delete user.password;
            return { profile: user };
        });
    }
    findProfile(id, followingUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const _profile = yield this.userRepository.findOne({ username: followingUsername });
            if (!_profile)
                return;
            let profile = {
                username: _profile.username,
                bio: _profile.bio,
                image: _profile.image
            };
            const follows = yield this.followsRepository.findOne({ followerId: id, followingId: _profile.id });
            if (id) {
                profile.following = !!follows;
            }
            return { profile };
        });
    }
    follow(followerEmail, username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!followerEmail || !username) {
                throw new http_exception_1.HttpException('Follower email and username not provided.', common_1.HttpStatus.BAD_REQUEST);
            }
            const followingUser = yield this.userRepository.findOne({ username });
            const followerUser = yield this.userRepository.findOne({ email: followerEmail });
            if (followingUser.email === followerEmail) {
                throw new http_exception_1.HttpException('FollowerEmail and FollowingId cannot be equal.', common_1.HttpStatus.BAD_REQUEST);
            }
            const _follows = yield this.followsRepository.findOne({ followerId: followerUser.id, followingId: followingUser.id });
            if (!_follows) {
                const follows = new follows_entity_1.FollowsEntity();
                follows.followerId = followerUser.id;
                follows.followingId = followingUser.id;
                yield this.followsRepository.save(follows);
            }
            let profile = {
                username: followingUser.username,
                bio: followingUser.bio,
                image: followingUser.image,
                following: true
            };
            return { profile };
        });
    }
    unFollow(followerId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!followerId || !username) {
                throw new http_exception_1.HttpException('FollowerId and username not provided.', common_1.HttpStatus.BAD_REQUEST);
            }
            const followingUser = yield this.userRepository.findOne({ username });
            if (followingUser.id === followerId) {
                throw new http_exception_1.HttpException('FollowerId and FollowingId cannot be equal.', common_1.HttpStatus.BAD_REQUEST);
            }
            const followingId = followingUser.id;
            yield this.followsRepository.delete({ followerId, followingId });
            let profile = {
                username: followingUser.username,
                bio: followingUser.bio,
                image: followingUser.image,
                following: false
            };
            return { profile };
        });
    }
};
ProfileService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __param(1, typeorm_1.InjectRepository(follows_entity_1.FollowsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileService);
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map