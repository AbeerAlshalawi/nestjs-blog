import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller({ path: 'user', version: '1.0' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Public()
  @Get(':id/followers')
  async getFollowers(@Param('id') userId: number) {
    const followers = await this.userService.getFollowers(userId);
    return followers.map((follow) => follow.follower);
  }

  @Public()
  @Get(':id/followings')
  async getFollowings(@Param('id') userId: number) {
    const followings = await this.userService.getFollowings(userId);
    return followings.map((follow) => follow.following);
  }

  @UseGuards(JwtGuard)
  @Post(':id/follow')
  async followUser(@Param('id') userId: number, @Request() req) {
    return this.userService.follow(req.user.id, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/unfollow')
  async unfollow(@Param('id') userId: number, @Request() req) {
    return this.userService.unfollow(req.user.id, userId);
  }
}
