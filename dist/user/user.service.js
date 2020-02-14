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
const user_entity_1 = require("./user.entity");
const jwt = require('jsonwebtoken');
const config_1 = require("../config");
const class_validator_1 = require("class-validator");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const common_2 = require("@nestjs/common");
const argon2 = require("argon2");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    findOne({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ email });
            if (!user) {
                return null;
            }
            if (yield argon2.verify(user.password, password)) {
                return user;
            }
            return null;
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = dto;
            const qb = yield typeorm_2.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.username = :username', { username })
                .orWhere('user.email = :email', { email });
            const user = yield qb.getOne();
            if (user) {
                const errors = { username: 'Username and email must be unique.' };
                throw new http_exception_1.HttpException({ message: 'Input data validation failed', errors }, common_2.HttpStatus.BAD_REQUEST);
            }
            let newUser = new user_entity_1.UserEntity();
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            newUser.articles = [];
            const errors = yield class_validator_1.validate(newUser);
            if (errors.length > 0) {
                const _errors = { username: 'Userinput is not valid.' };
                throw new http_exception_1.HttpException({ message: 'Input data validation failed', _errors }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                const savedUser = yield this.userRepository.save(newUser);
                return this.buildUserRO(savedUser);
            }
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let toUpdate = yield this.userRepository.findOne(id);
            delete toUpdate.password;
            delete toUpdate.favorites;
            let updated = Object.assign(toUpdate, dto);
            return yield this.userRepository.save(updated);
        });
    }
    delete(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.delete({ email: email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(id);
            if (!user) {
                const errors = { User: ' not found' };
                throw new http_exception_1.HttpException({ errors }, 401);
            }
            return this.buildUserRO(user);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ email: email });
            return this.buildUserRO(user);
        });
    }
    generateJWT(user) {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            exp: exp.getTime() / 1000,
        }, config_1.SECRET);
    }
    ;
    buildUserRO(user) {
        const userRO = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            token: this.generateJWT(user),
            image: user.image
        };
        return { user: userRO };
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map