import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Get all users with pending access status.
   */
  async getPendingUsers() {
    return this.usersService.findPendingUsers();
  }

  /**
   * Get all users.
   */
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  /**
   * Approve a user and send a Telegram notification if they have a chat ID.
   */
  async approveUser(userId: string) {
    const user = await this.usersService.updateAccessStatus(userId, 'approved');

    this.logger.log(`User approved: ${user.email}`);

    // Send Telegram notification if user has a chat ID
    if (user.telegramChatId) {
      await this.telegramService.sendMessage(
        user.telegramChatId,
        `✅ *Access Approved!*\n\n` +
          `Hello ${user.name}, your WeatherGuard account has been approved!\n\n` +
          `You will now receive hourly weather alerts. 🌤`,
      );
    }

    return user;
  }

  /**
   * Reject a user and send a Telegram notification if they have a chat ID.
   */
  async rejectUser(userId: string) {
    const user = await this.usersService.updateAccessStatus(userId, 'rejected');

    this.logger.log(`User rejected: ${user.email}`);

    // Send Telegram notification if user has a chat ID
    if (user.telegramChatId) {
      await this.telegramService.sendMessage(
        user.telegramChatId,
        `❌ *Access Rejected*\n\n` +
          `Hello ${user.name}, your WeatherGuard access request has been rejected.\n\n` +
          `Please contact the administrator for more information.`,
      );
    }

    return user;
  }
}
