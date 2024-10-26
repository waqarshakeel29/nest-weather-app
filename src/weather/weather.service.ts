// src/weather/weather.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import { Weather } from './entities/weather.entity';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY');
    this.apiUrl = this.configService.get<string>('API_URL');
  }

  async getWeather(city: string): Promise<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    return this.httpService.get(url).pipe(
      map(async (response) => {
        const data = response.data;
        const weatherData = this.weatherRepository.create({
          city,
          temperature: data.main.temp,
          timestamp: new Date(),
        });
        await this.weatherRepository.save(weatherData);
        return data;
      }),
      catchError((error) => {
        throw new HttpException(
          'City not found or API request failed',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  async getAllWeather(): Promise<Weather[]> {
    try {
      return await this.weatherRepository.find();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
