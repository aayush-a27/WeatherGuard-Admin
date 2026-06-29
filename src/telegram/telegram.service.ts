import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot!: TelegramBot;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const token = this.configService.get<string>('telegram.botToken');

    if (!token) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN is not set. Telegram features will be disabled.',
      );
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text || '';

      this.logger.log(`Received message from chat ${chatId}: ${text}`);

      if (text === '/start') {
        this.bot.sendMessage(
          chatId,
          `👋 Welcome to WeatherGuard Bot!\n\n` +
            `Your Chat ID is: \`${chatId}\`\n\n` +
            `Copy this ID and paste it in the WeatherGuard app to connect your Telegram account and receive weather alerts.`,
          { parse_mode: 'Markdown' },
        );
      }
    });

    this.bot.on('polling_error', (error) => {
      this.logger.error(`Telegram polling error: ${error.message}`);
    });

    this.logger.log('Telegram bot initialized with long-polling');
  }

  /**
   * Send a text message to a Telegram chat.
   */
  async sendMessage(chatId: string, text: string): Promise<void> {
    if (!this.bot) {
      this.logger.warn('Telegram bot is not initialized. Message not sent.');
      return;
    }

    try {
      await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
      this.logger.log(`Message sent to chat ${chatId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send message to chat ${chatId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
