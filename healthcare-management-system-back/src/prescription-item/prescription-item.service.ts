import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';

@Injectable()
export class PrescriptionItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePrescriptionItemDto) {
    return this.prisma.prescriptionItem.create({ data: dto });
  }

  async createBulk(dtos: CreatePrescriptionItemDto[]) {
    return this.prisma.prescriptionItem.createMany({ data: dtos });
  }

  async findAll() {
    return this.prisma.prescriptionItem.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.prescriptionItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`PrescriptionItem with id ${id} not found`);
    return item;
  }

  //traer el objeto medication 
  async findByPrescription(prescriptionId: number) {
    const items = await this.prisma.prescriptionItem.findMany({
      where: { prescriptionId },
      include: { medication: true },
    });
    if (items.length === 0) {
      throw new NotFoundException(`No items found for prescription ${prescriptionId}`);
    }
    return items;
  }




  async update(id: number, dto: UpdatePrescriptionItemDto) {
    await this.findOne(id);
    return this.prisma.prescriptionItem.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prescriptionItem.delete({ where: { id } });
  }
}