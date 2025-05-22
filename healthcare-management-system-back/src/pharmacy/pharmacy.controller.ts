import { Controller, Get, ParseIntPipe,Param, } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly service: PharmacyService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}