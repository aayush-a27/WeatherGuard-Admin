export interface WeatherResponse {
  temperature: number;
  humidity: number;
  condition: string;
  city: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
}
