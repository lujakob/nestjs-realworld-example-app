import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/passport/jwt.strategy';
import * as passport from 'passport';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), AuthModule],
  components: [ArticleService],
  controllers: [
    ArticleController
  ]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: '/api/articles', method: RequestMethod.ALL});
  }
}
