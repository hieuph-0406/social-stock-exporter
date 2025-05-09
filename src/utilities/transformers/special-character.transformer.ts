import { type TransformFnParams } from 'class-transformer';

export const specialCharacterTransformer = (
  params: TransformFnParams,
): string => params.value?.trim().replace(/([_%\\])/g, '\\$1');
