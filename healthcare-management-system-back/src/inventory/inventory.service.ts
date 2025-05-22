import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
    return this.prisma.inventory.create({ data: dto });
  }

  async findAll() {
    return this.prisma.inventory.findMany();
  }

  async findOne(id: number) {
    const record = await this.prisma.inventory.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Inventory record with id ${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateInventoryDto) {
    await this.findOne(id);
    return this.prisma.inventory.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.inventory.delete({ where: { id } });
  }
}
