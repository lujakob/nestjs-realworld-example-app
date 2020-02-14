import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('follows')
export class FollowsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

}
