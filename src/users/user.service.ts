import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Gender, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { faker } from '@faker-js/faker';
import { FilterDto } from 'src/common/filter.dto';
import { PageService } from 'src/common/page.service';

@Injectable()
export class UserService extends PageService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {
    super();
  }

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
      const randomUsername = faker.internet.username();
      const randomPassword = faker.internet.password();
      const randomGender = faker.helpers.arrayElement(Object.values(Gender));

      users.push({
        username: randomUsername,
        password: randomPassword,
        gender: randomGender,
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

  async getGender(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['gender'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.gender;
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
      followers: followers,
      followings: followings,
    };
  }

  async fillFollows() {
    const users = await this.userRepository.find();
    const totalFollows = 500_000;
    const follows: { follower: User; following: User }[] = [];

    for (let i = 0; i < totalFollows; i++) {
      const randomFollower = users[Math.floor(Math.random() * users.length)];
      const randomFollowing = users[Math.floor(Math.random() * users.length)];

      if (
        randomFollower.id !== randomFollowing.id &&
        !follows.some(
          (f) =>
            f.follower.id === randomFollower.id &&
            f.following.id === randomFollowing.id,
        )
      ) {
        follows.push({
          follower: randomFollower,
          following: randomFollowing,
        });

        if (follows.length % 10_000 === 0) {
          console.log('Inserting follow batch:', follows.length);
          await this.followRepository.insert(follows);
          follows.length = 0;
        }
      }
    }

    if (follows.length > 0) {
      await this.followRepository.insert(follows);
    }
  }

  async getFollowers(userId: number, filter?: FilterDto) {
    const where = { following: { id: userId } };

    const [followers, total] = await this.paginate(
      this.followRepository,
      filter,
      where,
      {
        follower: {
          id: true,
          username: true,
        },
      },
      {
        follower: true,
      },
    );

    return {
      data: followers,
      count: total,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async getFollowings(userId: number, filter?: FilterDto) {
    const where = { follower: { id: userId } };

    const [followings, total] = await this.paginate(
      this.followRepository,
      filter,
      where,
      {
        following: {
          id: true,
          username: true,
        },
      },
      {
        following: true,
      },
    );

    return {
      data: followings,
      count: total,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };
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
