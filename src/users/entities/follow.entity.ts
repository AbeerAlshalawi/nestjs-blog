import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_follow_on_follower_id')
  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: User;

  @Index('idx_follow_on_following_id')
  @ManyToOne(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
  following: User;
}
