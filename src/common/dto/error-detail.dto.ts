import { ApiProperty } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty()
  property: string;

  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  errorMessage: string;
}
