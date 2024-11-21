import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Follow } from './follow.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followings: Follow[];
}
