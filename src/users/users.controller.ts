import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { ConnectTelegramDto } from './dto/connect-telegram.dto';
import { UserDocument } from './schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the authenticated user profile' })
  async getMe(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Patch('connect-telegram')
  @ApiOperation({ summary: 'Connect Telegram chat ID to user account' })
  @ApiResponse({ status: 200, description: 'Telegram chat ID connected successfully' })
  async connectTelegram(
    @CurrentUser() user: UserDocument,
    @Body() dto: ConnectTelegramDto,
  ) {
    return this.usersService.updateTelegramChatId(
      (user as UserDocument & { _id: string })._id.toString(),
      dto.telegramChatId,
    );
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current user access status' })
  @ApiResponse({ status: 200, description: 'Returns the user access status' })
  async getStatus(@CurrentUser() user: UserDocument) {
    return {
      accessStatus: user.accessStatus,
      role: user.role,
    };
  }
}
