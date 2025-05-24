import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryItemDto } from './dto/inventory-item.dto';

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

  async getPharmacyInfo(pharmacyId: number) {
    return this.prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
      include: {
        user: true
      }
    });
  }

  // Inventory Methods
  async getInventory(pharmacyId: number) {
    // Assuming 'inventory' is the correct Prisma model name based on previous linter hints
    return this.prisma.inventory.findMany({
      where: { pharmacyId }
    });
  }

  async updateInventoryItem(
    itemId: number,
    data: Partial<InventoryItemDto>
  ) {
     // Assuming 'inventory' is the correct Prisma model name
    return this.prisma.inventory.update({
      where: { id: itemId },
      data
    });
  }

  async addInventoryItem(
    pharmacyId: number,
    data: Omit<InventoryItemDto, 'id'>
  ) {
    // First, find or create the medication
    const medication = await this.prisma.medication.findFirst({
      where: { name: data.medicationName }
    });

    if (!medication) {
      throw new Error(`Medication ${data.medicationName} not found`);
    }

    // Create the inventory item with the correct structure
    return this.prisma.inventory.create({
      data: {
        pharmacyId,
        medicationId: medication.id,
        quantity: data.stockLevel
      }
    });
  }
}