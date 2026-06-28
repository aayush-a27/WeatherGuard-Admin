import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectTelegramDto {
  @ApiProperty({
    description: 'The Telegram chat ID to associate with the user account',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telegram chat ID is required' })
  telegramChatId!: string;
}
