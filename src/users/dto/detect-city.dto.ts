import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetectCityDto {
  @ApiProperty({
    description: 'Latitude from browser geolocation',
    example: 28.6139,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({
    description: 'Longitude from browser geolocation',
    example: 77.209,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}
