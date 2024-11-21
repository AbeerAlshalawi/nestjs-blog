import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { faker } from '@faker-js/faker';

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

  async fillUsers() {
    const usersRepo: Repository<User> = this.userRepository;

    const chunkSize = 10_000;
    const totalUsers = 1_000_000;
    const users = [];

    for (let i = 0; i < totalUsers; i++) {
      const randomUsername = faker.internet.username;
      const randomPassword = faker.internet.password();

      users.push({
        username: randomUsername,
        password: randomPassword,
      });

      if (users.length === chunkSize) {
        console.log('Inserting chunk Number:', Math.floor(i / chunkSize) + 1);
        console.log('Percentage done:', ((i + 1) / totalUsers) * 100 + '%');
        await usersRepo.insert(users);
        users.length = 0;
      }
    }

    if (users.length > 0) {
      await usersRepo.insert(users);
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async findProfileById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const followers = await this.getFollowers(id);
    const followings = await this.getFollowings(id);

    return {
      user,
      followers: followers.map((follow) => follow.follower),
      followings: followings.map((follow) => follow.following),
    };
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
