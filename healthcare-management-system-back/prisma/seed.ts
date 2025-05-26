import {
  PrismaClient,
  UserRole,
  AppointmentStatus,
  PrescriptionItemStatus,
  NotificationType
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // ——— 0) Seed 5 usuarios PATIENT y 5 PHARMACY con password hasheadas ———
  const patientData = Array.from({ length: 5 }, (_, i) => ({
    username: `patient${i+1}`,
    email:    `patient${i+1}@example.com`,
    password: `Password*${i+1}`,
    role:     UserRole.Patient,
    phone:    `300300000${i+1}`,
  }));
  const pharmacyData = Array.from({ length: 5 }, (_, i) => ({
    username: `pharmacy${i+1}`,
    email:    `pharmacy${i+1}@example.com`,
    password: `Password*${i+6}`,
    role:     UserRole.Pharmacy,
    phone:    `310400000${i+1}`,
  }));

  const hashedPatients = await Promise.all(
    patientData.map(async u => ({
      ...u,
      password: await bcrypt.hash(u.password, SALT_ROUNDS)
    }))
  );
  const hashedPharmacies = await Promise.all(
    pharmacyData.map(async u => ({
      ...u,
      password: await bcrypt.hash(u.password, SALT_ROUNDS)
    }))
  );

  await prisma.user.createMany({ data: hashedPatients, skipDuplicates: true });
  await prisma.user.createMany({ data: hashedPharmacies, skipDuplicates: true });

  // recuperar los 5 primeros de cada rol
  const patientUsers  = await prisma.user.findMany({ where: { role: UserRole.Patient }, take: 5 });
  const pharmacyUsers = await prisma.user.findMany({ where: { role: UserRole.Pharmacy }, take: 5 });

  // ——— 1) Seed Patients ———
  const patients = await Promise.all(
    patientUsers.map((u, i) =>
      prisma.patient.create({
        data: {
          userId: u.id,
          dob:    new Date(1980 + i, (i*3) % 12, 10),
          address:`Calle ${i+1} #100-${i*5}, Ciudad Ejemplo`
        }
      })
    )
  );

  // ——— 2) Seed Pharmacies ———
  const pharmacies = await Promise.all(
    pharmacyUsers.map((u, i) =>
      prisma.pharmacy.create({
        data: {
          userId:  u.id,
          address: `Av. Siempre Viva ${200 + i}, Barrio Ejemplo`,
          lat:     4.710 + i * 0.0015,
          lng:    -74.072 - i * 0.0015
        }
      })
    )
  );

  // ——— 3) Seed Medications ———
  const medsData = [
    { name: 'Paracetamol', description: 'Analgésico y antipirético' },
    { name: 'Ibuprofeno',  description: 'Antiinflamatorio'        },
    { name: 'Amoxicilina', description: 'Antibiótico amplio'     },
    { name: 'Omeprazol',    description: 'Inhibidor bomba protones'},
    { name: 'Salbutamol',   description: 'Broncodilatador'        },
  ];
  const medications = await Promise.all(
    medsData.map(m => prisma.medication.create({ data: m }))
  );

  // ——— 4) Seed Inventory ———
  const invs = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.inventory.create({
        data: {
          pharmacyId:   pharmacies[i].id,
          medicationId: medications[i].id,
          quantity:     50 * (i+1)
        }
      })
    )
  );

  // ——— 5) Seed Prescriptions ———
  const prescriptions = await Promise.all(
    patients.map((p, i) =>
      prisma.prescription.create({
        data: {
          patientId:  p.id,
          pharmacyId: pharmacies[(i+1) % 5].id,
          fileUrl:    `prescriptions/presc_${p.id}.pdf`
        }
      })
    )
  );

  // ——— 6) Seed PrescriptionItems ———
  const items = await Promise.all(
    prescriptions.map((presc, i) =>
      prisma.prescriptionItem.create({
        data: {
          prescriptionId: presc.id,
          medicationId:   medications[i].id,
          quantity:       (i+1)*2,
          status:         PrescriptionItemStatus.PENDING
        }
      })
    )
  );

  // ——— 7) Seed Appointments ———
  const appointments = await Promise.all(
    patients.map((p, i) =>
      prisma.appointment.create({
        data: {
          patientId:      p.id,
          pharmacyId:     pharmacies[i].id,
          prescriptionId: prescriptions[i].id,             // ← nueva línea
          date:           new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          status:         AppointmentStatus.PENDING
        }
      })
    )
  );

  // ——— 8) Seed Notifications ———
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: patientUsers[0].id,
        type:   NotificationType.STATUS_CHANGED,
        message:'Tu prescripción fue aceptada.',
        read:   false
      }
    }),
    prisma.notification.create({
      data: {
        userId: patientUsers[1].id,
        type:   NotificationType.APPOINTMENT_REMINDER,
        message:'Recordatorio: cita mañana 10:00 AM.',
        read:   false
      }
    }),
    prisma.notification.create({
      data: {
        userId: pharmacyUsers[0].id,
        type:   NotificationType.PRESCRIPTION_UPDATED,
        message:'Nueva prescripción pendiente.',
        read:   false
      }
    }),
    prisma.notification.create({
      data: {
        userId: pharmacyUsers[1].id,
        type:   NotificationType.PRESCRIPTION_UPDATED,
        message:'Prescripción revisada (leer).',
        read:   true
      }
    }),
    prisma.notification.create({
      data: {
        userId: patientUsers[2].id,
        type:   NotificationType.STATUS_CHANGED,
        message:'Ítem en backorder.',
        read:   false
      }
    })
  ]);

  console.log('✅ Seed completado:', {
    patients:       patients.length,
    pharmacies:     pharmacies.length,
    medications:    medications.length,
    inventories:    invs.length,
    prescriptions:  prescriptions.length,
    items:          items.length,
    appointments:   appointments.length,
    notifications:  notifications.length
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });