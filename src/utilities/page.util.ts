import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Repository } from 'typeorm';

export const executeQueryRawSqlWithMeta = async ({
  repository,
  sqlData,
  pageOptions,
  parameters,
  defaultSort,
}: {
  repository: Repository<any>;
  sqlData: string;
  pageOptions: PageOptionsDto;
  parameters?: any[];
  defaultSort?: string;
}) => {
  const orderBy = defaultSort || '';
  if (orderBy != '') {
    sqlData = `${sqlData} ORDER BY ${orderBy}`;
  }
  if (pageOptions.pageIndex) {
    const limit = pageOptions.pageSize;
    const offset = (pageOptions.pageIndex - 1) * pageOptions.pageSize;
    sqlData = `${sqlData} LIMIT ${limit} OFFSET ${offset}`;
  }

  const data: [any] = await repository.query(sqlData, parameters);
  const pageOptionsDto = new PaginationDto({
    pageOptionsDto: pageOptions,
  });

  return { data, pageOptionsDto };
};
