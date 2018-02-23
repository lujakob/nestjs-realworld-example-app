import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Article {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @OneToOne(type => User)
  @JoinColumn()
  author: User;

  @OneToMany(type => Comment, comment => comment.article, {eager: true})
  @JoinColumn()
  comments: Comment[];

  @Column({default: 0})
  favoriteCount: number;
}