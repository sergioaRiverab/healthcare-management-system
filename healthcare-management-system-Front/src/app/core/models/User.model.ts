export interface User {
    id: number;
    username: string;
    email: string;
    role: 'Patient' | 'Doctor';
    phone?: string;
  }
  