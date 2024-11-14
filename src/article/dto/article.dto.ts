import { IsNotEmpty, IsString } from 'class-validator';
import { UserDTO } from 'src/user/dto/user.dto';

export class ArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  user: UserDTO;
}
