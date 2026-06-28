import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Runs every hour. Fetches weather and sends alerts to all
   * approved users who have connected their Telegram accounts.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleWeatherAlerts(): Promise<void> {
    this.logger.log('⏰ Cron job started: Sending weather alerts...');

    try {
      // 1. Fetch all approved users with Telegram chat IDs
      const users = await this.usersService.findApprovedUsersWithTelegram();

      if (users.length === 0) {
        this.logger.log('No approved users with Telegram. Skipping alerts.');
        return;
      }

      this.logger.log(`Found ${users.length} user(s) to notify.`);

      // 2. Fetch current weather data
      const weather = await this.weatherService.getWeather();
      const message = this.weatherService.formatWeatherMessage(weather);

      // 3. Send weather alerts to each user via Telegram
      const sendPromises = users.map(async (user) => {
        if (!user.telegramChatId) return;

        try {
          await this.telegramService.sendMessage(user.telegramChatId, message);
          this.logger.log(`Alert sent to: ${user.email}`);
        } catch (error) {
          this.logger.error(
            `Failed to send alert to ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      });

      await Promise.allSettled(sendPromises);

      this.logger.log('⏰ Cron job completed: Weather alerts sent.');
    } catch (error) {
      this.logger.error(
        `Cron job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
