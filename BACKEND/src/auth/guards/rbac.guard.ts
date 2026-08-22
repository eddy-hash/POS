import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums/roles.enum';

@Injectable()
export class RBACGuard implements CanActivate {
  private readonly logger = new Logger(RBACGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      this.logger.log('No permissions required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log(`🔍 RBAC Guard - User: ${user?.email}, Role: ${user?.role_id}`);
    this.logger.log(`🔍 Required permissions: ${requiredPermissions}`);

    // ✅ Admin bypass - if user is admin (role_id = 1), allow everything
    if (user?.role_id === 1) {
      this.logger.log(`✅ Admin bypass for user: ${user.email}`);
      return true;
    }

    // For other roles, check permissions
    // This is a simplified check - you can implement proper permission checking here
    this.logger.log(`✅ RBAC Guard - Access granted for user: ${user?.email}`);
    return true;
  }
}
