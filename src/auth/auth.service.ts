import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
    };
    return { id: user.id, access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByUsername(
      user.username,
    );
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
      articles: [],
      comments: [],
      followersCount: 0,
      followingsCount: 0,
      followers: [],
      followings: [],
    };
    await this.userService.create(newUser);
    return this.login(newUser);
  }
}
