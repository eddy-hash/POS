import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    if (!authHeader) {
      throw new UnauthorizedException('User not authenticated');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
      
      request.user = {
        id: payload.sub || payload.id || 1,
        email: payload.email,
        name: payload.name || 'Admin',
        role: payload.role || 'super_admin',
        permissions: payload.permissions || [],
      };

      return true;
    } catch (error: any) {
      console.error('❌ Token verification failed:', error.message || error);
      throw new UnauthorizedException('User not authenticated');
    }
  }
}
