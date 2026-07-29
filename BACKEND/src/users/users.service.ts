import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { PasswordHistory } from './entities/password-history.entity';

@Injectable()
export class UsersService {
  private readonly PASSWORD_HISTORY_LIMIT = 5; // Prevent reuse of last 5 passwords

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordHistory)
    private passwordHistoryRepository: Repository<PasswordHistory>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async create(userData: { email: string; password: string; name: string }): Promise<User> {
    // Check if user already exists
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      preferences: {},
    });

    const savedUser = await this.userRepository.save(user);

    // Save initial password to history
    await this.savePasswordHistory(savedUser.id, hashedPassword);

    return savedUser;
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    
    // Save to password history
    await this.savePasswordHistory(userId, hashedPassword);
    
    // Clean up old password history (keep only last N)
    await this.cleanPasswordHistory(userId);
  }

  async savePasswordHistory(userId: number, hashedPassword: string): Promise<void> {
    const history = this.passwordHistoryRepository.create({
      userId,
      password: hashedPassword,
    });
    await this.passwordHistoryRepository.save(history);
  }

  async cleanPasswordHistory(userId: number): Promise<void> {
    // Get all password history entries for this user, ordered by created_at DESC
    const history = await this.passwordHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Keep only the last N entries (where N = PASSWORD_HISTORY_LIMIT)
    if (history.length > this.PASSWORD_HISTORY_LIMIT) {
      const toDelete = history.slice(this.PASSWORD_HISTORY_LIMIT);
      await this.passwordHistoryRepository.remove(toDelete);
    }
  }

  async isPasswordInHistory(userId: number, newPassword: string): Promise<boolean> {
    // Get recent password history
    const history = await this.passwordHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: this.PASSWORD_HISTORY_LIMIT,
    });

    // Check if any of the historical passwords match the new one
    for (const entry of history) {
      const isMatch = await bcrypt.compare(newPassword, entry.password);
      if (isMatch) {
        return true;
      }
    }
    return false;
  }

  async updateProfile(userId: number, updateData: any): Promise<User> {
    const user = await this.findById(userId);
    
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.address !== undefined) user.address = updateData.address;
    
    if (updateData.email) {
      const existing = await this.findByEmail(updateData.email);
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }
    
    await this.userRepository.save(user);
    return user;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (!user.password) {
      throw new UnauthorizedException('User has no password set');
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException('New password must be different from current password');
    }
    
    // Check if password was used before
    const isInHistory = await this.isPasswordInHistory(userId, newPassword);
    if (isInHistory) {
      throw new BadRequestException(`Password was used recently. Please choose a different password.`);
    }
    
    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    
    // Save to password history
    await this.savePasswordHistory(userId, hashedPassword);
    await this.cleanPasswordHistory(userId);
  }

  async updatePreferences(userId: number, preferences: any): Promise<User> {
    const user = await this.findById(userId);
    
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
    
    await this.userRepository.save(user);
    return user;
  }

  async getNotificationPreferences(userId: number): Promise<any> {
    const user = await this.findById(userId);
    return user.preferences?.notifications || {
      sales: true,
      expenses: true,
      customers: false,
      promotions: false,
      email: true,
    };
  }

  async updateNotificationPreferences(userId: number, preferences: any): Promise<any> {
    const user = await this.findById(userId);
    
    if (!user.preferences) {
      user.preferences = {};
    }
    
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...preferences,
    };
    
    await this.userRepository.save(user);
    return user.preferences.notifications;
  }
}
