import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants/app.constant';
import { Role } from '../constants/enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
