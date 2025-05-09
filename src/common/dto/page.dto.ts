import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class PageDto<T> {
  @Expose()
  data: T[];

  @Expose()
  @ApiProperty()
  pagination: PaginationDto;

  constructor(data: T[], meta: PaginationDto) {
    this.data = data;
    this.pagination = meta;
  }
}
