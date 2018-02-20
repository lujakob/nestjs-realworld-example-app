import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
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

  @OneToOne(type => User)
  @JoinColumn()
  author: User;

  @OneToMany(type => Comment, comment => comment.article, {eager: true})
  @JoinColumn()
  comments: Comment[];
}