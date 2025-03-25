export class SignupDto {
    username: string;
    email: string;
    password: string;
    role: 'Patient' | 'Doctor';
    phone?: string;
  }
  