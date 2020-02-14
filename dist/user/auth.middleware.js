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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
const user_service_1 = require("./user.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(userService) {
        this.userService = userService;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeaders = req.headers.authorization;
            if (authHeaders && authHeaders.split(' ')[1]) {
                const token = authHeaders.split(' ')[1];
                const decoded = jwt.verify(token, config_1.SECRET);
                const user = yield this.userService.findById(decoded.id);
                if (!user) {
                    throw new http_exception_1.HttpException('User not found.', common_1.HttpStatus.UNAUTHORIZED);
                }
                req.user = user.user;
                next();
            }
            else {
                throw new http_exception_1.HttpException('Not authorized.', common_1.HttpStatus.UNAUTHORIZED);
            }
        });
    }
};
AuthMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map