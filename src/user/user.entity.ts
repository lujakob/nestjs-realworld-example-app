import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany} from "typeorm";
import {IsEmail, Validate} from "class-validator";
import * as crypto from 'crypto';
import { CustomEmail } from './CustomEmail';
import { Article } from '../article/article.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @ManyToMany(type => Article, {eager: true})
  @JoinTable()
  favorites: Article[]

}