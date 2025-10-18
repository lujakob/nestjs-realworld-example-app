import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileService } from "./profile.service";
import { BlockService } from "./block.service";
import { UserModule } from "../user/user.module";
import { UserEntity } from "../user/user.entity";
import { FollowsEntity } from "./follows.entity";
import { UserBlockEntity } from "../user/user-block.entity";
import { AuthMiddleware } from "../user/auth.middleware";
import { BlockController } from "./block.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity, UserBlockEntity]),
    UserModule,
  ],
  providers: [ProfileService, BlockService],
  controllers: [BlockController, ProfileController],
  exports: [],
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "profiles/:username/follow", method: RequestMethod.ALL },
        { path: "profiles/:username/block", method: RequestMethod.ALL },
        { path: "profiles/blocked", method: RequestMethod.GET }
      );
  }
}
