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
  async create(dto: CreatePrescriptionDto) {
    // renombramos pacienteId → patientUserId para mayor claridad
    const { patientId: patientUserId, pharmacyId, file } = dto;

    // 1) Verificar que la farmacia exista y obtener su userId
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
      select: { userId: true },
    });
    if (!pharmacy) {
      throw new NotFoundException(`Farmacia con id ${pharmacyId} no encontrada.`);
    }

    // 2) Verificar que el paciente exista y obtener su PK (id) y su userId
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientUserId },
      select: { id: true, userId: true },
    });
    if (!patient) {
      throw new NotFoundException(`Paciente con userId ${patientUserId} no encontrado.`);
    }

    // 3) Subir el PDF a B2
    const key = `prescriptions/presc-${patientUserId}-${Date.now()}.pdf`;
    const fileUrl = await this.b2.uploadFile(file.buffer, key);

    // 4) Crear la prescripción usando patient.id (PK)
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId:  patient.id,   // ← aquí usamos la PK
        pharmacyId,               // ya viene correcto
        fileUrl,
      },
      include: {
        patient:  true,
        pharmacy: true,
        items:    true,
      },
    });

    // 5) Notificación a la farmacia
    await this.prisma.notification.create({
      data: {
        userId:  pharmacy.userId,
        type:    NotificationType.PRESCRIPTION_UPDATED,
        message: `Nueva prescripción #${prescription.id} recibida.`,
      },
    });

    // 6) Notificación al paciente
    await this.prisma.notification.create({
      data: {
        userId:  patient.userId,
        type:    NotificationType.PRESCRIPTION_UPDATED,
        message: `Tu prescripción #${prescription.id} ha sido enviada a la farmacia.`,
      },
    });

    return prescription;
  }


  findAll() {
    return this.prisma.prescription.findMany();
  }

  //con patient y pharmacy
  findOne(id: number) {
    const prescription = this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient:  true,
        pharmacy: true,
        items:    true,
      },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescripción con id ${id} no encontrada.`);
    }
    return prescription;
  }

  async findByPharmacyUser(userId: number) {
    // 1) Localizar la farmacia por userId
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!pharmacy) {
      throw new NotFoundException(
        `No se encontró farmacia para el userId ${userId}`
      );
    }

    // 2) Obtener todas las prescripciones de esa farmacia
    const prescriptions = await this.prisma.prescription.findMany({
      where: { pharmacyId: pharmacy.id },
      select: {
        id:        true,
        fileUrl:   true,
        createdAt: true,
        patient: {
          select: {
            id: true,
            user: {
              select: {
                id:       true,
                username: true,
                email:    true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3) Mapear a un formato “plano” si lo prefieres
    return prescriptions.map(p => ({
      id:         p.id,
      fileUrl:    p.fileUrl,
      createdAt:  p.createdAt,
      patient: {
        id:       p.patient.id,
        userId:   p.patient.user.id,
        username: p.patient.user.username,
        email:    p.patient.user.email,
      }
    }));
  }


  update(id: number, dto: UpdatePrescriptionDto) {
    return this.prisma.prescription.update({ where: { id }, data: { ...dto } });
  }

  remove(id: number) {
    return this.prisma.prescription.delete({ where: { id } });
  }
}