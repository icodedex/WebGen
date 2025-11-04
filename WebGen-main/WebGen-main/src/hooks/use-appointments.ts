'use client';

import { useContext } from 'react';
import { AppointmentContext } from '@/context/appointment-context';

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
