import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}