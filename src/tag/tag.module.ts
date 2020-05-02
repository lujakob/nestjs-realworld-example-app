import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    TagService,
    PrismaService,
  ],
  controllers: [
    TagController
  ],
  exports: []
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
