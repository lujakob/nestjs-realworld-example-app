import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from "argon2";
import { ArticleEntity } from "../article/article.entity";
import { FollowsEntity } from "../profile/follows.entity";
import { CommentEntity } from "../article/comment.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany((type) => ArticleEntity, (article) => article, {
    cascade: true,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}
