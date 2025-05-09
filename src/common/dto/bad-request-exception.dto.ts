import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorDetailDto } from './error-detail.dto';

export class BadRequestExceptionDto {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty({
    isArray: true,
    type: ErrorDetailDto,
  })
  message: ErrorDetailDto[];

  @ApiProperty()
  error: string;
}
