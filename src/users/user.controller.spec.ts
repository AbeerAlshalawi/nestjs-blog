import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Gender } from './entities/user.entity';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findProfileById: jest.fn(),
      findOneByUsername: jest.fn(),
      getGender: jest.fn(),
      getFollowers: jest.fn(),
      getFollowings: jest.fn(),
      follow: jest.fn(),
      unfollow: jest.fn(),
    };

    const mockJwtGuard = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtGuard,
          useValue: mockJwtGuard,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = { username: 'testuser', password: 'password' };
      const createdUser = { ...createUserDto };
      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await userController.create(createUserDto);
      expect(result).toBe(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getUserProfile', () => {
    it('should return the user profile', async () => {
      const mockId = 1;
      const mockUserProfile = {
        username: 'testuser',
        gender: Gender.FEMALE,
        followersCount: 100,
        followingsCount: 50,
      };

      const mockRequest = {
        user: {
          id: mockId,
        },
      };

      jest
        .spyOn(userService, 'findProfileById')
        .mockResolvedValue(mockUserProfile);

      const result = await userController.getUserProfile(
        mockRequest as unknown as Request,
      );
      expect(userService.findProfileById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const mockUsername = 'testuser';
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password',
      };

      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result = await userController.findOneByUsername(mockUsername);
      expect(result).toEqual(mockUser);
      expect(userService.findOneByUsername).toHaveBeenCalledWith(mockUsername);
    });
  });

  describe('getGender', () => {
    it('should return the gender of a user', async () => {
      const mockId = 1;
      const mockGender = Gender.FEMALE;

      jest.spyOn(userService, 'getGender').mockResolvedValue(mockGender);

      const result = await userController.getGender(mockId);
      expect(result).toBe(mockGender);
      expect(userService.getGender).toHaveBeenCalledWith(mockId);
    });
  });

  describe('getFollowers', () => {
    it('should return a list of followers', async () => {
      const userId = 1;
      const filter = {};
      const mockFollowers = {
        data: [{ id: 2, username: 'follower1' }],
        count: 1,
        currentPage: 1,
        pageSize: 10,
      };

      jest.spyOn(userService, 'getFollowers').mockResolvedValue(mockFollowers);

      const result = await userController.getFollowers(userId, filter);
      expect(result).toEqual(mockFollowers);
      expect(userService.getFollowers).toHaveBeenCalledWith(userId, filter);
    });
  });

  describe('getFollowings', () => {
    it('should return a list of followings', async () => {
      const userId = 1;
      const filter = {};
      const mockFollowings = {
        data: [{ id: 2, username: 'following1' }],
        count: 1,
        currentPage: 1,
        pageSize: 10,
      };

      jest
        .spyOn(userService, 'getFollowings')
        .mockResolvedValue(mockFollowings);

      const result = await userController.getFollowings(userId, filter);
      expect(result).toEqual(mockFollowings);
      expect(userService.getFollowings).toHaveBeenCalledWith(userId, filter);
    });
  });

  describe('follow', () => {
    it('should return a 200 status code when a user follows another user', async () => {
      const followerId = 1;
      const followingId = 2;

      const mockRequest = {
        user: {
          id: followerId,
        },
      };

      jest.spyOn(userService, 'follow').mockResolvedValue(HttpStatus.OK);

      const result = await userController.follow(
        followingId,
        mockRequest as unknown as Request,
      );
      expect(userService.follow).toHaveBeenCalledWith(followerId, followingId);
      expect(result).toBe(HttpStatus.OK);
    });
  });

  describe('unfollow', () => {
    it('should return a 200 status code when a user follows another user', async () => {
      const followerId = 1;
      const followingId = 2;

      const mockRequest = {
        user: {
          id: followerId,
        },
      };

      jest.spyOn(userService, 'unfollow').mockResolvedValue(HttpStatus.OK);

      const result = await userController.unfollow(
        followingId,
        mockRequest as unknown as Request,
      );
      expect(userService.unfollow).toHaveBeenCalledWith(
        followerId,
        followingId,
      );
      expect(result).toBe(HttpStatus.OK);
    });
  });
});
