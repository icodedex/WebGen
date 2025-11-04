
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  password?: string;
  mustChangePassword?: boolean;
  // Doctor specific
  specialty?: string;
  experience?: number;
  rating?: number;
  availableHours?: string;
  consultationFee?: number;
  licenseNumber?: string;
  // Patient specific
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
};

export type MedicalRecord = {
  patientId: string;
  diagnoses: string[];
  medications: string[];
  allergies: string[];
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height?: number; // in cm
  weight?: number; // in kg
};

export type Appointment = {
  id:string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied' | 'rescheduled' | 'cancelled';
  suggestedDate?: string;
  cancellationReason?: string;
};

export type PMRFile = {
    id: string;
    name: string;
    type: 'pdf' | 'image';
    url: string; // URL to the stored file
};

export type PMR = {
    patientId: string;
    files: PMRFile[];
    accessCode: {
        code: string;
        expiresAt: string; // ISO string
    } | null;
};
