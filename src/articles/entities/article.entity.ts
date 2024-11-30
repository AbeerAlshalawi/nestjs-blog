import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_articles_on_title')
  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
