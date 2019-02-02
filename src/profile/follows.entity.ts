import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {IsEmail, Validate} from "class-validator";
import * as crypto from 'crypto';
// import { CustomEmail } from '../user/CustomEmail';

@Entity('follows')
export class FollowsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

}
