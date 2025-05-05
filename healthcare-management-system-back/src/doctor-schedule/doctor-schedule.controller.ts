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
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';
import { DoctorScheduleEntity } from './entities/doctor-schedule.entity';

@Controller('doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly service: DoctorScheduleService) {}

  @Post()
  create(@Body() dto: CreateDoctorScheduleDto): Promise<DoctorScheduleEntity> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<DoctorScheduleEntity[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DoctorScheduleEntity> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorScheduleDto,
  ): Promise<DoctorScheduleEntity> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DoctorScheduleEntity> {
    return this.service.remove(id);
  }
}
