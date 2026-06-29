import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly defaultCity: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
    private readonly telegramService: TelegramService,
  ) {
    this.defaultCity = this.configService.get<string>('weather.defaultCity') || 'London';
  }

  /**
   * Runs every hour. Fetches weather per user's preferred city
   * and sends personalized alerts to all approved Telegram-connected users.
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

      // 2. Group users by their preferred city (fallback to default)
      const cityUserMap = new Map<string, UserDocument[]>();

      for (const user of users) {
        const city = user.city || this.defaultCity;
        const existing = cityUserMap.get(city) || [];
        existing.push(user);
        cityUserMap.set(city, existing);
      }

      this.logger.log(`Fetching weather for ${cityUserMap.size} unique city/cities: ${[...cityUserMap.keys()].join(', ')}`);

      // 3. For each unique city, fetch weather once and send to all users in that city
      for (const [city, cityUsers] of cityUserMap) {
        try {
          const weather = await this.weatherService.getWeather(city);
          const message = this.weatherService.formatWeatherMessage(weather);

          // Send to each user subscribed to this city
          const sendPromises = cityUsers.map(async (user) => {
            if (!user.telegramChatId) return;

            try {
              await this.telegramService.sendMessage(user.telegramChatId, message);
              this.logger.log(`Alert sent to ${user.email} (city: ${city})`);
            } catch (error) {
              this.logger.error(
                `Failed to send alert to ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
              );
            }
          });

          await Promise.allSettled(sendPromises);
        } catch (error) {
          this.logger.error(
            `Failed to fetch weather for city "${city}": ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }

      this.logger.log('⏰ Cron job completed: Weather alerts sent.');
    } catch (error) {
      this.logger.error(
        `Cron job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
