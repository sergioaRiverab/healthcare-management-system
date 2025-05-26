export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Patient' | 'Pharmacy';
  phone?: string;
  dob?: string; 
  address?: string;
  lat?: number;
  lng?: number;
}
