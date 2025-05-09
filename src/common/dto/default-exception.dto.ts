import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultExceptionDto {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;
}
