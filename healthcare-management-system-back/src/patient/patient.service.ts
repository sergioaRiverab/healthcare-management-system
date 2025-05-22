import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class PatientService {

  constructor(private readonly prisma: PrismaService) {}


  async findAll() {
    return this.prisma.patient.findMany();
  }

  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
    return patient;
  }


}
