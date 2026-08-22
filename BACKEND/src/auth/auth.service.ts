import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ResetToken } from './entities/reset-token.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`🔍 Validating user: ${email}`);
    
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = user.role_id === 1;
    
    this.logger.log(`✅ User found: ${user.id}, isAdmin: ${isAdmin}`);
    this.logger.log(`📊 Current failed attempts: ${user.failedLoginAttempts || 0}`);

    if (!isAdmin) {
      const lockStatus = await this.usersService.isUserLocked(user.id);
      if (lockStatus.locked) {
        this.logger.warn(`🔒 User ${user.id} is locked: ${lockStatus.message}`);
        throw new ForbiddenException(lockStatus.message);
      }
    } else {
      await this.usersService.resetFailedLoginAttempts(user.id);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`❌ Invalid password for user: ${user.id}`);
      
      if (!isAdmin) {
        this.logger.log(`📊 Incrementing failed attempts for user: ${user.id}`);
        await this.usersService.incrementFailedLoginAttempts(user.id);
        
        const lockStatus = await this.usersService.isUserLocked(user.id);
        if (lockStatus.locked) {
          this.logger.warn(`🔒 User ${user.id} has been locked after too many attempts`);
          throw new ForbiddenException(lockStatus.message);
        }
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`✅ Valid password for user: ${user.id}, resetting attempts`);
    await this.usersService.resetFailedLoginAttempts(user.id);
    await this.usersService.updateProfile(user.id, { lastLogin: new Date() });

    const { password: _, ...result } = user;
    return {
      ...result,
      isAdmin,
    };
  }

  async login(user: any) {
    // Fetch the full user with role relation
    const fullUser = await this.usersService.findById(user.id);
    const roleName = fullUser.role?.name || 'viewer';
    const isAdmin = fullUser.role_id === 1;

    const payload = {
      email: fullUser.email,
      sub: fullUser.id,
      isAdmin,
      role_id: fullUser.role_id || 4,
    };

    this.logger.log(`📊 Login payload: ${JSON.stringify(payload)}`);

    // Debug: log the user object we are about to return
    const userResponse = {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      role_id: fullUser.role_id || 4,
      role: roleName,
      isAdmin,
    };
    console.log('🔍 FINAL user response:', JSON.stringify(userResponse, null, 2));

    return {
      access_token: this.jwtService.sign(payload),
      user: userResponse,
    };
  }

  async register(registerDto: { email: string; password: string; name: string }) {
    try {
      const user = await this.usersService.create(registerDto);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    const { password: _, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, updateData: any) {
    return this.usersService.updateProfile(userId, updateData);
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    return this.usersService.changePassword(userId, currentPassword, newPassword);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    this.logger.log(`Password reset requested for: ${email}`);
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If your email is registered, you will receive a reset link.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.resetTokenRepository.delete({ userId: user.id, isUsed: false });

    const resetToken = this.resetTokenRepository.create({
      userId: user.id,
      token,
      expiresAt,
      isUsed: false,
    });
    await this.resetTokenRepository.save(resetToken);

    console.log(`\n🔑 ===== RESET TOKEN =====`);
    console.log(`Email: ${email}`);
    console.log(`Token: ${token}`);
    console.log(`Expires: ${expiresAt.toLocaleString()}`);
    console.log(`========================\n`);

    return { message: 'If your email is registered, you will receive a reset link.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    this.logger.log('Password reset attempt with token');
    
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token, isUsed: false },
      relations: { user: true },
    });

    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new UnauthorizedException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(resetToken.userId, hashedPassword);
    await this.resetTokenRepository.update(resetToken.id, { isUsed: true });

    this.logger.log(`✅ Password reset successful for user ID: ${resetToken.userId}`);
    return { message: 'Password has been reset successfully.' };
  }
}
