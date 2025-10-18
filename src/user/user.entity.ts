import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from "argon2";
import { ArticleEntity } from "../article/article.entity";
import { UserBlockEntity } from "./user-block.entity";

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

  @ManyToMany((type) => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => UserBlockEntity, (userBlock) => userBlock.blocker)
  blockedUsers: UserBlockEntity[];

  @OneToMany(() => UserBlockEntity, (userBlock) => userBlock.blocked)
  blockedByUsers: UserBlockEntity[];
}
