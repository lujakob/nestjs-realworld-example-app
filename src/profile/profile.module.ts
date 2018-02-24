import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import {UserEntity} from "../user/user.entity";
import {FollowsEntity} from "./follows.entity";
import {AuthMiddleware} from "../user/auth.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity]), UserModule],
  components: [ProfileService],
  controllers: [
    ProfileController
  ],
  exports: []
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'profiles/:username/follow', method: RequestMethod.ALL});
  }
}
