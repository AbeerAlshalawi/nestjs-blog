import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const { username, password } = createUserDto;

    if (!username || !password) {
      throw new HttpException(
        'Username and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  getFollowers(userId: number) {
    return this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
      select: {
        follower: {
          id: true,
          username: true,
        },
      },
    });
  }

  getFollowings(userId: number) {
    return this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
      select: {
        following: {
          id: true,
          username: true,
        },
      },
    });
  }

  async follow(followerId: number, followingId: number) {
    if (followerId == followingId) {
      throw new HttpException('IDs can not match', HttpStatus.BAD_REQUEST);
    }

    const follower = await this.userRepository.findOneBy({ id: followerId });
    const following = await this.userRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isFollowed = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (isFollowed) {
      return;
    }

    const follow = this.followRepository.create({
      follower,
      following,
    });

    await this.followRepository.save(follow);
  }

  async unfollow(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new HttpException('User is not followed', HttpStatus.NOT_FOUND);
    }

    await this.followRepository.remove(follow);
  }
}
