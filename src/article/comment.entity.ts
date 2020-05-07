import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ArticleEntity } from "./article.entity";
import { UserEntity } from "../user/user.entity";

@Entity("comment")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => ArticleEntity, (article) => article.comments, {
    cascade: true,
  })
  article: ArticleEntity;

  @ManyToOne((type) => UserEntity, (user) => user.comments, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  author: UserEntity;
}
