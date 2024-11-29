import { Transform } from 'class-transformer';
import { SortOrder } from './sort-order-enum';
import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';

export class FilterDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  filter?: any;
}
