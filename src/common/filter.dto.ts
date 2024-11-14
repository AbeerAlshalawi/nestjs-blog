import { SortOrder } from './sort-order-enum';
import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  public orderBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
