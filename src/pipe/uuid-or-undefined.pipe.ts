import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseUUIDOrUndefinedPipe
  implements PipeTransform<string | undefined>
{
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (!isUUID(value)) {
      throw new BadRequestException(
        `Validation failed on ${metadata.data}: Not a valid UUID`,
      );
    }

    return value;
  }
}
