import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PharmacyService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pharmacy.findMany();
  }

  async findOne(id: number) {
    const pharmacy = await this.prisma.pharmacy.findUnique({ where: { id } });
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with id ${id} not found`);
    }
    return pharmacy;
  }
}