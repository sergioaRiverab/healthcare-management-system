import { Controller, Get, ParseIntPipe,Param, ParseFloatPipe, Query, BadRequestException, } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly service: PharmacyService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('nearby')
findNearby(
  @Query('lat', ParseFloatPipe) lat: number,
  @Query('lng', ParseFloatPipe) lng: number,
  @Query('limit', ParseIntPipe) limit = 4,
): Promise<{ id: number; name: string; lat: number; lng: number; distance: number }[]> {
    if (isNaN(lat) || isNaN(lng) || isNaN(limit)) {
      throw new BadRequestException('lat, lng y limit deben ser numéricos');
    }
    return this.service.findNearby(lat, lng, limit);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }



}