import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InventoryItemDto } from './dto/inventory-item.dto';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('info')
  async getPharmacyInfo(@Request() req) {
    return this.pharmacyService.getPharmacyInfo(req.user.pharmacyId);
  }

  // Inventory Endpoints
  @Get('inventory')
  async getInventory(@Request() req) {
    return this.pharmacyService.getInventory(req.user.pharmacyId);
  }

  @Post('inventory')
  async addInventoryItem(
    @Request() req,
    @Body() data: Omit<InventoryItemDto, 'id'>
  ) {
    return this.pharmacyService.addInventoryItem(req.user.pharmacyId, data);
  }

  @Put('inventory/:id')
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() data: Partial<InventoryItemDto>
  ) {
    return this.pharmacyService.updateInventoryItem(parseInt(id), data);
  }
}