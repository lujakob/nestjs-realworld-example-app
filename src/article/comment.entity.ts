import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { UserEntity } from "../user/user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  @ManyToOne((type) => UserEntity)
  author: UserEntity;
}
