import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalServiceException extends HttpException {
  constructor(error: any) {
    super(
      {
        error,
      },
      error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
