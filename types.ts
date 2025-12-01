export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface Procedure {
  id: string;
  name: string;
  category: string;
  price: number;
}

export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  COMPLETED = 'Realizado',
  CANCELLED = 'Cancelado'
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string; // Denormalized for easier display
  date: string; // ISO Date string
  time: string; // HH:mm
  procedureId: string;
  procedureName: string; // Denormalized
  price: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppData {
  clients: Client[];
  procedures: Procedure[];
  appointments: Appointment[];
}