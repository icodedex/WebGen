import { AppointmentForm } from '@/components/patient/appointment-form';
import { AppointmentsList } from '@/components/patient/appointments-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Calendar className="h-8 w-8 text-primary"/>
        <h1 className="text-3xl font-bold font-headline">Appointments</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request an Appointment</CardTitle>
              <CardDescription>
                Fill out the form below to request a new appointment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
            <AppointmentsList />
        </div>
      </div>
    </div>
  );
}
