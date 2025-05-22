import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { B2Service } from '../files/b2.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly b2: B2Service,
  ) {}

  /** Create with nearest pharmacy flow */
 async createWithNearestPharmacy(dto: CreatePrescriptionDto) {
    // 1) Traer farmacias
    const pharmacies = await this.prisma.pharmacy.findMany({
      select: { id: true, lat: true, lng: true, userId: true }
    });
    if (!pharmacies.length) {
      throw new Error('No hay farmacias registradas');
    }

    // 1.a) Calcular distancia (Haversine)
    const toRad = (x: number) => x * Math.PI / 180;
    const dist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat/2)**2
              + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
              * Math.sin(dLon/2)**2;
      return 2 * 6371e3 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    // 1.b) Encontrar la farmacia más cercana
    let nearest = pharmacies[0];
    let minD = dist(dto.patientLat, dto.patientLng, nearest.lat, nearest.lng);
    for (const ph of pharmacies) {
      const d = dist(dto.patientLat, dto.patientLng, ph.lat, ph.lng);
      if (d < minD) {
        minD = d;
        nearest = ph;
      }
    }

    // 2) Subir PDF a B2
    const key = `prescriptions/presc-${dto.patientId}-${Date.now()}.pdf`;
    const url = await this.b2.uploadFile(dto.file.buffer, key);

    // 3) Guardar Prescription
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId:  dto.patientId,
        pharmacyId: nearest.id,
        fileUrl:    url,
      },
      include: { patient: true, pharmacy: true, items: true }
    });

    // 4) Crear notificación para la farmacia
    await this.prisma.notification.create({
      data: {
        userId:  nearest.userId,
        type:    NotificationType.PRESCRIPTION_UPDATED,
        message: `Nueva prescripción #${prescription.id} recibida.`,
      }
    });

    return prescription;
  }

  findAll() {
    return this.prisma.prescription.findMany();
  }

  findOne(id: number) {
    return this.prisma.prescription.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdatePrescriptionDto) {
    return this.prisma.prescription.update({ where: { id }, data: { ...dto } });
  }

  remove(id: number) {
    return this.prisma.prescription.delete({ where: { id } });
  }
}