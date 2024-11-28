// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';

// describe('UserController', () => {
//   let controller: UserController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: Partial<UserService>;

  beforeEach(async () => {
    userService = {
      findOneByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should return a user for a valid username', async () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      articles: [],
      comments: [],
      followers: [],
      followings: [],
    };

    jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(mockUser);

    const result = await userController.findOneByUsername('testuser');
    expect(result).toEqual(mockUser);
    expect(userService.findOneByUsername).toHaveBeenCalledWith('testuser');
  });

  it('should return null for a non-existing username', async () => {
    jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null);

    const result = await userController.findOneByUsername('nonexistent');
    expect(result).toBeNull();
    expect(userService.findOneByUsername).toHaveBeenCalledWith('nonexistent');
  });
});
