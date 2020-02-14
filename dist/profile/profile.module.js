"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const profile_controller_1 = require("./profile.controller");
const typeorm_1 = require("@nestjs/typeorm");
const profile_service_1 = require("./profile.service");
const user_module_1 = require("../user/user.module");
const user_entity_1 = require("../user/user.entity");
const follows_entity_1 = require("./follows.entity");
const auth_middleware_1 = require("../user/auth.middleware");
let ProfileModule = class ProfileModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: 'profiles/:username/follow', method: common_1.RequestMethod.ALL });
    }
};
ProfileModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, follows_entity_1.FollowsEntity]), user_module_1.UserModule],
        providers: [profile_service_1.ProfileService],
        controllers: [
            profile_controller_1.ProfileController
        ],
        exports: []
    })
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=profile.module.js.map