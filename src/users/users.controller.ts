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
import { WeatherService } from '../weather/weather.service';
import { ConnectTelegramDto } from './dto/connect-telegram.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { DetectCityDto } from './dto/detect-city.dto';
import { UserDocument } from './schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
  ) {}

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

  @Patch('city')
  @ApiOperation({ summary: 'Set preferred city for weather alerts' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  async updateCity(
    @CurrentUser() user: UserDocument,
    @Body() dto: UpdateCityDto,
  ) {
    return this.usersService.updateCity(
      (user as UserDocument & { _id: string })._id.toString(),
      dto.city,
    );
  }

  @Patch('detect-city')
  @ApiOperation({ summary: 'Auto-detect city from browser geolocation coordinates' })
  @ApiResponse({ status: 200, description: 'City detected and saved to user profile' })
  async detectCity(
    @CurrentUser() user: UserDocument,
    @Body() dto: DetectCityDto,
  ) {
    // Resolve city name from lat/lon via OpenWeatherMap
    const cityName = await this.weatherService.getCityFromCoordinates(
      dto.latitude,
      dto.longitude,
    );

    // Save the detected city to the user profile
    return this.usersService.updateCity(
      (user as UserDocument & { _id: string })._id.toString(),
      cityName,
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
