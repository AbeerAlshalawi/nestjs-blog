import { User } from 'src/user/entities/user.entity';

export class CreateArticleDto {
  title: string;
  body: string;
  user: User;
}
