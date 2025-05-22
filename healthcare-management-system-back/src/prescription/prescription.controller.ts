import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Sólo se permiten PDFs'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadPrescription(
    @UploadedFile() file: any,
    @Body() body: { patientId: string; patientLat: string; patientLng: string },
  ) {
    const dto: CreatePrescriptionDto = {
      patientId:  parseInt(body.patientId, 10),
      patientLat: parseFloat(body.patientLat),
      patientLng: parseFloat(body.patientLng),
      file,
    };
    return this.prescriptionService.createWithNearestPharmacy(dto);
  }

  @Get()
  findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionService.remove(id);
  }
}
