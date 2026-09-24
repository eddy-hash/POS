import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RBACGuard } from './guards/rbac.guard';
import { ResetToken } from './entities/reset-token.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([User, ResetToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
    NotificationsModule, // ✅ added
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RBACGuard],
  exports: [AuthService, JwtModule, RBACGuard],
})
export class AuthModule {}
