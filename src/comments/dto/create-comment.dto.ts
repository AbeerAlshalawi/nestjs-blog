import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
