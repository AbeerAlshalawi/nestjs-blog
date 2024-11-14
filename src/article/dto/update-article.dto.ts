import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDTO } from './create-article.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;
}
