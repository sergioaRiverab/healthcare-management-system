import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FilesModule } from '../files/files.module'



@Module({
  imports: [FilesModule],
  controllers: [PrescriptionController],
  providers: [PrescriptionService,PrismaService],
})
export class PrescriptionModule {}
