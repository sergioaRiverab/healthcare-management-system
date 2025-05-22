import { Module } from '@nestjs/common';
import { PrescriptionItemService } from './prescription-item.service';
import { PrescriptionItemController } from './prescription-item.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [PrescriptionItemController],
  providers: [PrescriptionItemService,PrismaService],
})
export class PrescriptionItemModule {}
