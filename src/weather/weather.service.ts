import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherResponse } from './interfaces/weather-response.interface';

interface OpenWeatherMapResponse {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly defaultCity: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('weather.apiKey') || '';
    this.defaultCity = this.configService.get<string>('weather.defaultCity') || 'London';
  }

  /**
   * Fetch current weather data for a given city (or the default city).
   */
  async getWeather(city?: string): Promise<WeatherResponse> {
    const targetCity = city || this.defaultCity;

    this.logger.log(`Fetching weather for: ${targetCity}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherMapResponse>(this.baseUrl, {
          params: {
            q: targetCity,
            appid: this.apiKey,
            units: 'metric',
          },
        }),
      );

      const data = response.data;

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0]?.description || 'Unknown',
        city: data.name,
        icon: data.weather[0]?.icon || '',
        feelsLike: Math.round(data.main.feels_like),
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather for ${targetCity}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Format weather data into a human-readable Telegram message.
   */
  formatWeatherMessage(weather: WeatherResponse): string {
    return (
      `🌤 *WeatherGuard Alert*\n\n` +
      `📍 *City:* ${weather.city}\n` +
      `🌡 *Temperature:* ${weather.temperature}°C (Feels like ${weather.feelsLike}°C)\n` +
      `💧 *Humidity:* ${weather.humidity}%\n` +
      `🌬 *Wind Speed:* ${weather.windSpeed} m/s\n` +
      `☁️ *Condition:* ${weather.condition}\n\n` +
      `_Updated at ${new Date().toLocaleTimeString()}_`
    );
  }

  /**
   * Resolve a city name from latitude/longitude coordinates
   * using OpenWeatherMap's weather API (which returns the city name).
   */
  async getCityFromCoordinates(lat: number, lon: number): Promise<string> {
    this.logger.log(`Resolving city from coordinates: lat=${lat}, lon=${lon}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherMapResponse>(this.baseUrl, {
          params: {
            lat,
            lon,
            appid: this.apiKey,
            units: 'metric',
          },
        }),
      );

      const cityName = response.data.name;
      this.logger.log(`Resolved city: ${cityName}`);
      return cityName;
    } catch (error) {
      this.logger.error(
        `Failed to resolve city from coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
