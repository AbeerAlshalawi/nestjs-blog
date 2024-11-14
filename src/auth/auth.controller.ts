import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller({ path: 'auth', version: '1.0' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    if (!registerBody.username || !registerBody.password) {
      throw new HttpException(
        'Username and password are requiured',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.register(registerBody);
  }
}
