import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileService } from "./profile.service";
import { UserModule } from "../user/user.module";
import { UserEntity } from "../user/user.entity";
import { AuthMiddleware } from "../user/auth.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "profiles/:username/follow",
      method: RequestMethod.ALL,
    });
  }
}
