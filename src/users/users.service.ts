import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export interface OAuthProfile {
  name: string;
  email: string;
  provider: 'google' | 'github';
  avatar?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Find a user by email address.
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Find a user by their MongoDB _id.
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Create a new user from an OAuth profile.
   * If the user already exists (by email), return the existing user.
   */
  async findOrCreateFromOAuth(profile: OAuthProfile): Promise<UserDocument> {
    const existingUser = await this.findByEmail(profile.email);

    if (existingUser) {
      this.logger.log(`Existing user logged in: ${profile.email}`);
      return existingUser;
    }

    const newUser = new this.userModel({
      name: profile.name,
      email: profile.email.toLowerCase(),
      provider: profile.provider,
      role: 'user',
      accessStatus: 'pending',
      avatar: profile.avatar || null,
    });

    const savedUser = await newUser.save();
    this.logger.log(`New user created: ${profile.email} via ${profile.provider}`);
    return savedUser;
  }

  /**
   * Update a user's Telegram chat ID.
   */
  async updateTelegramChatId(
    userId: string,
    telegramChatId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { telegramChatId }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    this.logger.log(`Telegram chat ID updated for user: ${user.email}`);
    return user;
  }

  /**
   * Find all approved users who have a Telegram chat ID configured.
   * Used by the scheduler to send weather alerts.
   */
  async findApprovedUsersWithTelegram(): Promise<UserDocument[]> {
    return this.userModel
      .find({
        accessStatus: 'approved',
        telegramChatId: { $ne: null, $exists: true },
      })
      .exec();
  }

  /**
   * Find all users with pending access status.
   */
  async findPendingUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ accessStatus: 'pending' }).exec();
  }

  /**
   * Find all users.
   */
  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  /**
   * Update a user's access status (approve/reject).
   */
  async updateAccessStatus(
    userId: string,
    accessStatus: 'approved' | 'rejected',
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { accessStatus }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    this.logger.log(`User ${user.email} access status updated to: ${accessStatus}`);
    return user;
  }
}
