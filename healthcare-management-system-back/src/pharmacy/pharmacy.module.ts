import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService,PrismaService],
})
export class PharmacyModule {}
