import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  AfterUpdate,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CommentEntity } from "./comment.entity";

@Entity("article")
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @Column("simple-array")
  tagList: string[];

  @ManyToOne((type) => UserEntity, (user) => user.articles, {
    eager: true,
  })
  @JoinColumn()
  author: UserEntity;

  @OneToMany((type) => CommentEntity, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: CommentEntity[];

  @Column({ default: 0 })
  favoritesCount: number;
}
