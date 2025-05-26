import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


interface RawPharmacy {
  id: number;
  address: string;
  lat: number;
  lng: number;
  userId: number;
}

interface NearbyPharmacy {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: number;
}
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


    async findNearby(lat: number, lng: number, limit: number): Promise<NearbyPharmacy[]> {
    const all: RawPharmacy[] = await this.prisma.pharmacy.findMany();

    // Haversine
    const toRad = (x: number) => (x * Math.PI) / 180;
    const earthR = 6371; // km

    const withDist = all.map(p => {
      const dLat = toRad(p.lat - lat);
      const dLon = toRad(p.lng - lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) *
          Math.cos(toRad(p.lat)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthR * c;

      return {
        id: p.id,
        name: p.address,    // mapeamos address → name
        lat: p.lat,
        lng: p.lng,
        distance,
      };
    });

    // ordenamos y limitamos
    return withDist
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  
}