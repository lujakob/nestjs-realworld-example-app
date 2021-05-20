/**
 * 用户信息储存实体类
 */
import {
  Entity,
  PrimaryGeneratedColumn, 
  Column, 
  BeforeInsert, 
  JoinTable, 
  ManyToMany, 
  OneToMany
} from 'typeorm';
// 校验库
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';

// 通过entity装饰器装饰User模型，将为此类模型创建数据库表。
@Entity('user')
export class UserEntity {
  // 自动生成主列
  @PrimaryGeneratedColumn()
  id: number;
  // @Column 装饰器表示该字段为一个数据库列
  @Column()
  username: string;

  @Column()
  // 通过校验库校验email的格式是否正确
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany(type => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];
}
