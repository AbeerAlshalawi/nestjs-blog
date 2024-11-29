import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Follow } from './follow.entity';

export enum Gender {
  FEMALE = 'Female',
  MALE = 'Male',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index('idx_users_on_username')
  @Column()
  username: string;

  @Column()
  password: string;

  @Index('idx_users_on_gender')
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ default: 0 })
  followersCount: number;

  @Column({ default: 0 })
  followingsCount: number;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followings: Follow[];
}
