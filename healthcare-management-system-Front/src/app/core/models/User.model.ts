export interface User {
    id: number;
    username: string;
    email: string;
    role: 'Patient' | 'Doctor' | 'Pharmacy';
    phone?: string;
    pharmacyName?: string;
    pharmacyPhone?: string;
    pharmacyAddress?: string;
    lat?: number;
    lng?: number;
}
  