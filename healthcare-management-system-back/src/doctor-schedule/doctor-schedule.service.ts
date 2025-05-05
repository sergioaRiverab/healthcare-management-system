import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';
import { DoctorScheduleEntity } from './entities/doctor-schedule.entity';


@Injectable()
export class DoctorScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDoctorScheduleDto): Promise<DoctorScheduleEntity> {
    return this.prisma.doctorSchedule.create({ data: dto });
  }

  async findAll(): Promise<DoctorScheduleEntity[]> {
    return this.prisma.doctorSchedule.findMany();
  }

  async findOne(id: number): Promise<DoctorScheduleEntity> {
    const sched = await this.prisma.doctorSchedule.findUnique({ where: { id } });
    if (!sched) throw new NotFoundException(`Schedule #${id} not found`);
    return sched;
  }

  async update(
    id: number,
    dto: UpdateDoctorScheduleDto,
  ): Promise<DoctorScheduleEntity> {
    try {
      return await this.prisma.doctorSchedule.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException(`Schedule #${id} not found`);
    }
  }

  async remove(id: number): Promise<DoctorScheduleEntity> {
    try {
      return await this.prisma.doctorSchedule.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Schedule #${id} not found`);
    }
  }
}
