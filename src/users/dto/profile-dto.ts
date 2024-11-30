import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender } from '../entities/user.entity';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @IsNotEmpty()
  followersCount: number;

  @IsNumber()
  @IsNotEmpty()
  followingsCount: number;
}
