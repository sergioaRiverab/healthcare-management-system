import { PrismaClient } from '@prisma/client';

export const AppointmentStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',

}

export const DayOfWeek = {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY',
}

const prisma = new PrismaClient();

async function main() {
  // 1. Crear 5 usuarios con rol Doctor
  const doctorUsers = await Promise.all([
    prisma.user.create({ data: { username: 'doctor1', email: 'doctor1@example.com', password: 'hashedPwd1', role: 'Doctor', phone: '3002000001' } }),
    prisma.user.create({ data: { username: 'doctor2', email: 'doctor2@example.com', password: 'hashedPwd2', role: 'Doctor', phone: '3002000002' } }),
    prisma.user.create({ data: { username: 'doctor3', email: 'doctor3@example.com', password: 'hashedPwd3', role: 'Doctor', phone: '3002000003' } }),
    prisma.user.create({ data: { username: 'doctor4', email: 'doctor4@example.com', password: 'hashedPwd4', role: 'Doctor', phone: '3002000004' } }),
    prisma.user.create({ data: { username: 'doctor5', email: 'doctor5@example.com', password: 'hashedPwd5', role: 'Doctor', phone: '3002000005' } }),
  ]);

  // 2. Crear 5 usuarios con rol Patient
  const patientUsers = await Promise.all([
    prisma.user.create({ data: { username: 'patient1', email: 'patient1@example.com', password: 'hashedPwd6', role: 'Patient', phone: '3003000001' } }),
    prisma.user.create({ data: { username: 'patient2', email: 'patient2@example.com', password: 'hashedPwd7', role: 'Patient', phone: '3003000002' } }),
    prisma.user.create({ data: { username: 'patient3', email: 'patient3@example.com', password: 'hashedPwd8', role: 'Patient', phone: '3003000003' } }),
    prisma.user.create({ data: { username: 'patient4', email: 'patient4@example.com', password: 'hashedPwd9', role: 'Patient', phone: '3003000004' } }),
    prisma.user.create({ data: { username: 'patient5', email: 'patient5@example.com', password: 'hashedPwd10', role: 'Patient', phone: '3003000005' } }),
  ]);

  // 3. Crear registros de Doctor
  const doctors = await Promise.all(
    doctorUsers.map((u, i) =>
      prisma.doctor.create({
        data: {
          userId: u.id,
          specialty: `Specialty ${i + 1}`,
          schedule: `Mon-Fri 9:00-17:00`,
        },
      })
    )
  );

  // 4. Crear registros de Patient
  const patients = await Promise.all(
    patientUsers.map((u, i) =>
      prisma.patient.create({
        data: {
          userId: u.id,
          dob: new Date(1990 + i, i, 1),
          address: `Address ${i + 1}`,
          medicalHistory: `Medical history entry #${i + 1}`,
        },
      })
    )
  );

  // 5. Crear horarios de doctores (DoctorSchedule)
  const days = Object.values(DayOfWeek);
  const schedules = await Promise.all(
    doctors.map((d, i) =>
      prisma.doctorSchedule.create({
        data: {
          doctorId: d.id,
          day: days[i % days.length],
          startTime: new Date(2025, 4, 1, 9, 0),
          endTime: new Date(2025, 4, 1, 17, 0),
        },
      })
    )
  );

  // 6. Crear citas (Appointment)
  const appointments = await Promise.all(
    patients.map((p, i) =>
      prisma.appointment.create({
        data: {
          date: new Date(2025, 4, 10 + i, 10 + i, 0),
          notes: `Appointment note #${i + 1}`,
          status: AppointmentStatus.PENDING,
          patientId: p.id,
          doctorId: doctors[i].id,
        },
      })
    )
  );

  console.log(`Seed completed: Users=${doctorUsers.length + patientUsers.length}, Doctors=${doctors.length}, Patients=${patients.length}, Schedules=${schedules.length}, Appointments=${appointments.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });