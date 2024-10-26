// src/weather/weather.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { Weather } from './entities/weather.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Weather])],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
