import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/constants/app.constant';
import { MaxSafeInteger } from '@/decorators/max-safe-integer.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiPropertyOptional({ example: DEFAULT_PAGE_INDEX })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @MaxSafeInteger()
  @IsOptional()
  pageIndex?: number = DEFAULT_PAGE_INDEX;

  @ApiPropertyOptional({ example: DEFAULT_PAGE_SIZE })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @MaxSafeInteger()
  @IsOptional()
  pageSize?: number = DEFAULT_PAGE_SIZE;
}
