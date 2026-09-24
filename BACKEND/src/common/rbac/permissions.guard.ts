import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { getPermissionsForRole } from './role-permissions';
import { Permission } from './permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger('PermissionsGuard');
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // No metadata → nothing to enforce
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    // ⚠️ No user yet → JwtAuthGuard will handle auth (401). Don't block here.
    if (!user) {
      this.logger.debug(`No user yet for ${ctx.getClass().name}.${ctx.getHandler().name} — deferring`);
      return true;
    }

    // No role on user → this is a real config error, block
    if (!user.role) throw new ForbiddenException('No role assigned');

    const granted = getPermissionsForRole(user.role);
    const ok = required.every((p) => granted.includes(p));

    this.logger.log(
      `${ctx.getClass().name}.${ctx.getHandler().name} role=${user.role} required=[${required.join(',')}] ok=${ok}`,
    );

    if (!ok) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
