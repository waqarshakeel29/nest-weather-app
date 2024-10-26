// src/weather/weather.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string) {
    if (!city) {
      return { error: 'Please provide a city name.' };
    }
    return this.weatherService.getWeather(city);
  }

  @Get('all')
  getAllWeather() {
    return this.weatherService.getAllWeather();
  }
}
