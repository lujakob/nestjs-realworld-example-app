import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
// 校验库
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

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
