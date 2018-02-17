import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import * as crypto from 'crypto';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
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