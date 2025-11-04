import type { User, Appointment, MedicalRecord, PMR } from '@/lib/types';

export const users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@WebGen.com',
    role: 'admin',
    password: 'password',
  },
  {
    id: 'doc-1',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@WebGen.com',
    role: 'doctor',
    password: 'password',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    availableHours: '09:00 - 17:00',
    consultationFee: 150,
    licenseNumber: 'MD-12345',
  },
  {
    id: 'doc-2',
    name: 'Dr. Ben Hanson',
    email: 'ben.hanson@WebGen.com',
    role: 'doctor',
    password: 'password',
    specialty: 'Neurology',
    experience: 12,
    rating: 4.9,
    availableHours: '10:00 - 18:00',
    consultationFee: 180,
    licenseNumber: 'MD-67890',
  },
  {
    id: 'patient-1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'patient',
    password: 'password',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    dateOfBirth: '1985-05-20',
    gender: 'Male',
  },
  {
    id: 'patient-2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'patient',
    password: 'password',
    phone: '987-654-3210',
    address: '456 Oak Ave, Somecity, USA',
    dateOfBirth: '1992-11-15',
    gender: 'Female',
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    patientId: 'patient-1',
    diagnoses: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril', 'Metformin'],
    allergies: ['Penicillin'],
    bloodGroup: 'O+',
    height: 180,
    weight: 85,
  },
  {
    patientId: 'patient-2',
    diagnoses: ['Asthma'],
    medications: ['Albuterol Inhaler'],
    allergies: ['Pollen', 'Dust Mites'],
    bloodGroup: 'A-',
    height: 165,
    weight: 60,
  },
];

export const appointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    doctorId: 'doc-1',
    doctorName: 'Dr. Emily Carter',
    date: '2024-08-15T10:00:00Z',
    reason: 'Annual check-up.',
    status: 'pending',
  },
  {
    id: 'appt-2',
    patientId: 'patient-2',
    patientName: 'Jane Smith',
    doctorId: 'doc-2',
    doctorName: 'Dr. Ben Hanson',
    date: '2024-08-16T14:30:00Z',
    reason: 'Follow-up for migraines.',
    status: 'approved',
  },
  {
    id: 'appt-3',
    patientId: 'patient-1',
    patientName: 'John Doe',
    doctorId: 'doc-2',
    doctorName: 'Dr. Ben Hanson',
    date: '2024-08-20T09:00:00Z',
    reason: 'Consultation about headaches.',
    status: 'pending',
  },
    {
    id: 'appt-4',
    patientId: 'patient-2',
    patientName: 'Jane Smith',
    doctorId: 'doc-1',
    doctorName: 'Dr. Emily Carter',
    date: '2024-07-25T11:00:00Z',
    reason: 'Chest pain evaluation.',
    status: 'denied',
  },
];

export const pmrData: PMR[] = [
    {
        patientId: 'patient-1',
        files: [
            { id: 'file-1', name: 'Blood_Test_Results.pdf', type: 'pdf', url: '/mock-records/blood-test.pdf' },
            { id: 'file-2', name: 'Chest_XRay.jpg', type: 'image', url: '/mock-records/x-ray.jpg' },
        ],
        accessCode: null,
    },
    {
        patientId: 'patient-2',
        files: [
            { id: 'file-3', name: 'MRI_Scan_Report.pdf', type: 'pdf', url: '/mock-records/mri-report.pdf' },
        ],
        accessCode: null,
    }
];
