import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { username: user.username, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByUsername(
      user.username,
    );
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = { ...user, password: hashedPassword, articles: [] };
    await this.userService.create(newUser);
    return this.login(newUser);
  }
}
