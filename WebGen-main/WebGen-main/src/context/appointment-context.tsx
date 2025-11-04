'use client';

import type { Appointment } from '@/lib/types';
import { appointments as initialAppointments } from '@/lib/data';
import { createContext, useState, type ReactNode } from 'react';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status'], details?: { suggestedDate?: string; cancellationReason?: string }) => void;
  patientRespondToReschedule: (appointmentId: string, response: 'accept' | 'deny', newSuggestedDate?: string) => void;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt-${Date.now()}`,
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status'], details?: { suggestedDate?: string; cancellationReason?: string }) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === appointmentId ? { ...appt, status, ...details } : appt
      )
    );
  };

  const patientRespondToReschedule = (appointmentId: string, response: 'accept' | 'deny', newSuggestedDate?: string) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === appointmentId) {
        if (response === 'accept') {
          return { ...appt, status: 'approved', date: appt.suggestedDate!, suggestedDate: undefined };
        }
        if (response === 'deny') {
          return { ...appt, status: 'denied', suggestedDate: undefined };
        }
      }
      return appt;
    }));
  }

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointmentStatus, patientRespondToReschedule }}>
      {children}
    </AppointmentContext.Provider>
  );
}
