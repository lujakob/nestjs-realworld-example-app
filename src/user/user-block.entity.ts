import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_block")
export class UserBlockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.blockedUsers)
  @JoinColumn({ name: "blocker_id" })
  blocker: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.blockedByUsers)
  @JoinColumn({ name: "blocked_id" })
  blocked: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
