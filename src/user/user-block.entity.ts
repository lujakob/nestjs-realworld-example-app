import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_block")
export class UserBlockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.blockedUsers)
  blocker: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.blockedByUsers)
  blocked: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
