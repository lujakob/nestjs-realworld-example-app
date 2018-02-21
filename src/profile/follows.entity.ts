import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import {IsEmail, Validate} from "class-validator";
import * as crypto from 'crypto';
import { CustomEmail } from '../user/CustomEmail';

@Entity()
export class Follows {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

}