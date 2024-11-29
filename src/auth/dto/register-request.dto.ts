import { IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/users/entities/user.entity';

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  gender: Gender;
}
