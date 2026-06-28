import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { UsersModule } from '../users/users.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [UsersModule, WeatherModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
