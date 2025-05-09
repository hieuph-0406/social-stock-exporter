import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/constants/app.constant';

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PageOptionsDto } from './page-options.dto';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  totalItems?: number;
}

export class PaginationDto {
  @Expose()
  @ApiProperty()
  hasMore: boolean;

  @Expose()
  @ApiProperty()
  pageIndex: number;

  @Expose()
  @ApiProperty()
  pageSize: number;

  @Expose()
  @ApiProperty()
  totalItems: number;

  @Expose()
  @ApiProperty()
  totalPages: number;

  constructor({ pageOptionsDto, totalItems }: IPageMetaDtoParameters) {
    this.pageIndex = pageOptionsDto.pageIndex || DEFAULT_PAGE_INDEX;
    this.pageSize =
      pageOptionsDto.pageSize >= 0
        ? pageOptionsDto.pageSize
        : DEFAULT_PAGE_SIZE;
    this.setTotalItems(totalItems || 0);
  }

  setTotalItems(totalItems: number) {
    this.totalItems = totalItems;
    this.totalPages =
      this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 0;
    this.hasMore = this.pageIndex < this.totalPages;
  }
}
