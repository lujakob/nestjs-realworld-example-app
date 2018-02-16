import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), ArticleModule],
  controllers: [
    AppController
  ],
  components: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}