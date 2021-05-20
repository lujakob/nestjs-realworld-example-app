import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    // 将 TypeOrmModule 导入AppModule 
    // 可以将配置写在 forRoot 方法内，也可以在根目录创建 ormconfig.json 此项目使用ormconfig.json
    // forRoot() 方法支持所有TypeORM包中createConnection()函数暴露出的配置属性
    // 储存库使用顺序
    // 1. 在全局模块中使用TypeOrmModule.forRoot连接数据库
    // 2. 在各模块中创建Entity实体，用Entity方法修饰该实体类。 并为实体类创建表字段
    // 3. 在各模块Module import中使用TypeOrmModule.forFeature([UserEntity]) 注册存储实体
    // 4. 在各模块中使用@InjectRepository()方法将依赖注入到Service中
    TypeOrmModule.forRoot(),
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
