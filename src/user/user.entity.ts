import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import {IsEmail, Validate} from "class-validator";
import * as crypto from 'crypto';
import { CustomEmail } from './CustomEmail';

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

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

}