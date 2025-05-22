import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicationModule } from './medication/medication.module';
import { InventoryModule } from './inventory/inventory.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { PrescriptionItemModule } from './prescription-item/prescription-item.module';
import { AppointmentModule } from './appointment/appointment.module';
import { NotificationModule } from './notification/notification.module';


@Module({
  imports: [AuthModule,
    UserModule, 
    PatientModule, 
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PharmacyModule,
    MedicationModule,
    InventoryModule,
    PrescriptionModule,
    PrescriptionItemModule,
    AppointmentModule,
    NotificationModule
  ],
  controllers: [UserController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
