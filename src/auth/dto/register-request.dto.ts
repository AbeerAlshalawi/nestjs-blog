import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
