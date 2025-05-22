import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PrescriptionItemService } from './prescription-item.service';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';

@Controller('prescription-items')
export class PrescriptionItemController {
  constructor(private readonly service: PrescriptionItemService) {}

  @Post()
  create(@Body() dto: CreatePrescriptionItemDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionItemDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}