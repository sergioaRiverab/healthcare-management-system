import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DoctorService } from './doctor/doctor.service';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module';


@Module({
  imports: [AuthModule,
    UserModule, 
    DoctorModule,
    PatientModule, 
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AppointmentModule,
    DoctorScheduleModule
  ],
  controllers: [UserController, AppointmentController],
  providers: [AppService, UserService, DoctorService, PrismaService],
})
export class AppModule {}
