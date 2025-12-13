
export type UserRole = 'DONOR' | 'ADMIN' | 'HOSPITAL';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For simulated auth
  bloodType: string;
  role: UserRole;
  totalDonations: number;
  livesSaved: number;
  lastDonationDate: string;
  location?: string;
  status: 'Active' | 'Inactive';
}

export interface Center {
  id: string;
  name: string;
  address: string;
  distance: string;
  openUntil: string;
  rating: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  availability: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DONATE = 'DONATE',
  APPOINTMENTS = 'APPOINTMENTS', // New view for Doctor Appointments
  ASSISTANT = 'ASSISTANT',
  PROFILE = 'PROFILE',
  // Admin/Hospital Views
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  FIND_DONOR = 'FIND_DONOR'
}
