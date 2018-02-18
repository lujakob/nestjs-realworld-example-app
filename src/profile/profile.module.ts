import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import {User} from "../user/user.entity";
import {Follows} from "./follows.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Follows]), UserModule],
  components: [ProfileService],
  controllers: [
    ProfileController
  ],
  exports: []
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
  }
}
