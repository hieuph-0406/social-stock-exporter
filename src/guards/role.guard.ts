import { ROLES } from '@/constants/app.constant';
import { Role } from '@/constants/enum';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user?.role);
  }

  private matchRoles(roles: number[], roleOfUser: number): boolean {
    if (Role.Admin === roleOfUser) {
      return true;
    }
    return roles.includes(roleOfUser);
  }
}
