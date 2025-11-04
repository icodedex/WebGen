'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from '@/hooks/use-appointments';
import { useAuth } from '@/hooks/use-auth';
import { CalendarPlus } from 'lucide-react';
import type { Appointment } from '@/lib/types';

const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor.'),
  date: z.string().min(1, 'Please select a date.'),
  reason: z.string().min(5, 'Please provide a reason (min. 5 characters).'),
});

const doctors = users.filter((u) => u.role === 'doctor');

export function AppointmentForm() {
  const { toast } = useToast();
  const { addAppointment } = useAppointments();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: '',
      date: '',
      reason: '',
    },
  });

  const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
    if (!user) return;

    const doctor = doctors.find(doc => doc.id === values.doctorId);
    if (!doctor) return;

    const newAppointment: Omit<Appointment, 'id'> = {
        patientId: user.id,
        patientName: user.name,
        doctorId: values.doctorId,
        doctorName: doctor.name,
        date: new Date(values.date).toISOString(),
        reason: values.reason,
        status: 'pending'
    };
    
    addAppointment(newAppointment);

    toast({
      title: 'Appointment Requested',
      description: 'Your request has been sent. You will be notified upon confirmation.',
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Visit</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe your reason for the visit..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <CalendarPlus />
            Request Appointment
        </Button>
      </form>
    </Form>
  );
}
