import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FilterDto } from 'src/common/filter.dto';

@Controller({ path: 'user', version: '1.0' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('fillUsers')
  async fillUsers() {
    await this.userService.fillUsers();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('myProfile')
  async getUserProfile(@Request() req) {
    return await this.userService.findProfileById(req.user.id);
  }

  @Public()
  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Public()
  @Get(':id/gender')
  async getGender(@Param('id') userId: number) {
    return await this.userService.getGender(userId);
  }

  @Public()
  @Post('fillFollows')
  async fillFollows() {
    await this.userService.fillFollows();
  }

  @Public()
  @Get(':id/followers')
  async getFollowers(@Param('id') userId: number, @Query() filter: FilterDto) {
    const followers = await this.userService.getFollowers(userId, filter);
    return followers;
  }

  @Public()
  @Get(':id/followings')
  async getFollowings(@Param('id') userId: number, @Query() filter: FilterDto) {
    const followings = await this.userService.getFollowings(userId, filter);
    return followings;
  }

  @UseGuards(JwtGuard)
  @Post(':id/follow')
  async follow(@Param('id') userId: number, @Request() req) {
    return this.userService.follow(req.user.id, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/unfollow')
  async unfollow(@Param('id') userId: number, @Request() req) {
    return this.userService.unfollow(req.user.id, userId);
  }
}
