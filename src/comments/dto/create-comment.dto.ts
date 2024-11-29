import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  user: User;
}
