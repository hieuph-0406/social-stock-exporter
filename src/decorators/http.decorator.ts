import { BadRequestExceptionDto } from '@/common/dto/bad-request-exception.dto';
import { DefaultExceptionDto } from '@/common/dto/default-exception.dto';
import { PageDto } from '@/common/dto/page.dto';
import { ErrorMessage } from '@/constants/error-message.constant';
import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export function getSchema(statusCode: string | number, message?: string) {
  return {
    schema: {
      type: 'object',
      example: {
        statusCode: statusCode,
        message: message ?? ErrorMessage[statusCode],
      },
    },
    description: message ?? ErrorMessage[statusCode],
  };
}

export function ApiPublic(
  type?: Type<object>,
  options?: {
    summary: string;
    description?: string;
  },
  statusCode = HttpStatus.OK,
): MethodDecorator {
  const decorators = [
    ApiInternalServerErrorResponse({
      ...getSchema(HttpStatus.INTERNAL_SERVER_ERROR),
    }),
    ApiBadRequestResponse({
      type: () => BadRequestExceptionDto,
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    }),
    ApiNotFoundResponse({
      type: () => BadRequestExceptionDto,
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
    ApiOperation({ summary: options?.summary }),
  ];

  switch (statusCode) {
    case HttpStatus.CREATED:
      decorators.unshift(
        ApiCreatedResponse({
          type: type,
          description: options?.description ?? 'OK',
        }),
      );
      break;
    default:
      decorators.unshift(
        ApiOkResponse({
          type: type,
          description: options?.description ?? 'OK',
        }),
      );
      break;
  }
  return applyDecorators(...decorators);
}

export function ApiAuth(
  type?: Type<object>,
  options?: {
    summary: string;
    description?: string;
  },
  statusCode = HttpStatus.OK,
): MethodDecorator {
  const arrDecorator = [
    ApiUnauthorizedResponse({
      type: () => DefaultExceptionDto,
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      type: () => DefaultExceptionDto,
      status: HttpStatus.FORBIDDEN,
      description: 'Forbidden',
    }),
    ApiInternalServerErrorResponse({
      type: () => DefaultExceptionDto,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
    }),
    ApiBadRequestResponse({
      type: () => BadRequestExceptionDto,
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    }),
    ApiNotFoundResponse({
      type: () => BadRequestExceptionDto,
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
    ApiOperation({ summary: options?.summary }),
  ];

  arrDecorator.push(
    ApiOkResponse({
      type: type,
      description: options?.description ?? 'OK',
    }),
  );

  return applyDecorators(...arrDecorator, HttpCode(statusCode));
}

export function ApiPageOkResponse<T extends Type>(options: {
  type: T;
  description?: string;
  summary?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
            required: ['data'],
          },
        ],
      },
    }),
    ApiOperation({ summary: options.summary }),
  );
}
