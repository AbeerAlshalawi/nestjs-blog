import { UserDto } from 'src/user/dto/user.dto';

export class ArticleDto {
  title: string;
  body: string;
  user: UserDto;
}
