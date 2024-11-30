import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FollowerDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class FollowingDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
