import { SortOrder } from './sort-order-enum';
import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';

export class GenericFilter {
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;

  @IsString()
  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
