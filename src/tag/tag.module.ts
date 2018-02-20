import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), UserModule],
  components: [TagService],
  controllers: [
    TagController
  ],
  exports: []
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
  }
}
