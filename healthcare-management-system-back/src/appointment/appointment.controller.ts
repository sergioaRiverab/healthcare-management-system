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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}



  @Post()
  create(@Body() dto: CreateAppointmentDto) {
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

    @Get('patient/:id')
  findAllByPatient(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllByPatient(id);
  }


    @Get('patient/:userId')
  findAllByPatientAppoinment(@Param('userId', ParseIntPipe) id: number) {
    return this.service.findAllByPatient(id);
  }
    @Get('pharmacy/:id')
  findAllByPharmacyAppoinment(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllByPharmacyAppoinment(id);
  }


  //cancel appointment
  @Patch('cancel/:id')
  cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.service.cancelAppointment(id, dto);
  }
  
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  //appointments de un patient especifico

}
