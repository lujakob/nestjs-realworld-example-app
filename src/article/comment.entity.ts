import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
} from "typeorm";
import { ArticleEntity } from "./article.entity";
import { UserEntity } from "../user/user.entity";

@Entity("comment")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne((type) => ArticleEntity, (article) => article.comments, {
    cascade: true,
    onDelete: "CASCADE",
  })
  article: ArticleEntity;

  @ManyToOne((type) => UserEntity, (user) => user.comments)
  @JoinColumn()
  author: UserEntity;
}
