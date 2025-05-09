import { DefaultExceptionDto } from '@/common/dto/default-exception.dto';
import { ExternalServiceException } from '@/exceptions/external-service.exception';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(ExternalServiceException)
export class ExternalServiceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExternalServiceExceptionFilter.name);
  catch(exception: ExternalServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const defaultExceptionDto = new DefaultExceptionDto();
    defaultExceptionDto.statusCode = exception.getStatus();
    defaultExceptionDto.message = exception.message;

    const logMessage = `${exception.constructor.name} occurred at ${new Date().toISOString()} - Status: ${defaultExceptionDto.statusCode}, Message: ${defaultExceptionDto.message}`;

    this.logger.error([logMessage, exception.stack]);

    response.status(exception.getStatus()).json(defaultExceptionDto);
  }
}
