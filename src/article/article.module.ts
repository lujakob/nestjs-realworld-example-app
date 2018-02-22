import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Follows } from '../profile/follows.entity';
import { ArticleService } from './article.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, User, Follows]), UserModule],
  components: [ArticleService],
  controllers: [
    ArticleController
  ]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
  }
}
