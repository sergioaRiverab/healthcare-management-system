import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicationDto) {
    return this.prisma.medication.create({ data: dto });
  }

  async findAll() {
    return this.prisma.medication.findMany();
  }

  async findOne(id: number) {
    const med = await this.prisma.medication.findUnique({ where: { id } });
    if (!med) throw new NotFoundException(`Medication with id ${id} not found`);
    return med;
  }

  async update(id: number, dto: UpdateMedicationDto) {
    await this.findOne(id);
    return this.prisma.medication.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.medication.delete({ where: { id } });
  }
}
