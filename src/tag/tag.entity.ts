import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import {IsEmail, Validate} from "class-validator";
import * as crypto from 'crypto';
import { CustomEmail } from './CustomEmail';

@Entity()
export class Tag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

}