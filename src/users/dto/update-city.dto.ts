import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCityDto {
  @ApiProperty({
    description: 'The city name for personalized weather alerts',
    example: 'Mumbai',
  })
  @IsString()
  @IsNotEmpty({ message: 'City name is required' })
  @MaxLength(100, { message: 'City name must not exceed 100 characters' })
  city!: string;
}
