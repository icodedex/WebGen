
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/hooks/use-appointments';
import { users } from '@/lib/data';
import type { Appointment, User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Check,
  X,
  Star,
  Briefcase,
  Users,
  Stethoscope,
  HeartPulse,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DoctorCalendar } from '@/components/doctor/doctor-calendar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { CancellationDialog } from '@/components/shared/cancellation-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function DoctorProfileSummary({ doctor, totalPatients }: { doctor: User; totalPatients: number }) {
  const profileItems = [
    { icon: Briefcase, label: 'Experience', value: `${doctor.experience} years` },
    { icon: Star, label: 'Rating', value: `${doctor.rating}/5.0` },
    { icon: Users, label: 'Total Patients', value: totalPatients },
  ];
  const heroImage = PlaceHolderImages.find(p => p.id === 'doctor-dashboard-hero');

  return (
    <Card className="overflow-hidden">
        <div className="relative h-48 w-full">
            {heroImage && (
                <Image 
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute bottom-0 left-0 p-6 flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src={`https://avatar.vercel.sh/${doctor.email}.png`} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <Stethoscope className="h-6 w-6" />
                      {doctor.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-white/90">
                    <HeartPulse className="h-4 w-4" />
                    {doctor.specialty}
                    </CardDescription>
                </div>
            </div>
        </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-muted p-2 rounded-md">
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PatientsList({ patients }: { patients: User[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handlePatientClick = (patientId: string) => {
        router.push(`/doctor/patients/${patientId}`);
    };

    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Patients</CardTitle>
                <CardDescription>A list of patients you have consulted. Click on a patient to view details.</CardDescription>
                <div className="relative pt-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <TableRow 
                                        key={patient.id} 
                                        className="cursor-pointer"
                                        onClick={() => handlePatientClick(patient.id)}
                                    >
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell>{patient.email}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        No patients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default function DoctorPage() {
  const { user: doctor } = useAuth();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const doctorPatients = useMemo(() => {
    if (!doctor) return [];
    const patientIds = new Set(
        appointments
        .filter(appt => appt.doctorId === doctor.id)
        .map(appt => appt.patientId)
    );
    return users.filter(user => user.role === 'patient' && patientIds.has(user.id));
  }, [doctor, appointments]);

  useEffect(() => {
    if (doctor) {
      setDoctorAppointments(
        appointments.filter((appt) => appt.doctorId === doctor.id)
      );
    }
  }, [doctor, appointments]);

  const { toast } = useToast();

  const handleStatusChange = (
    appointmentId: string,
    status: 'approved' | 'denied'
  ) => {
    updateAppointmentStatus(appointmentId, status);
    toast({
      title: `Appointment ${status}`,
      description: `The appointment has been successfully ${status}.`,
    });
  };

  const handleCancel = (reason: string) => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'cancelled', { cancellationReason: reason });
      toast({
        title: `Appointment cancelled`,
        description: `The appointment has been successfully cancelled.`,
      });
    }
  };

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };


  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'denied':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  if (!doctor) return null;

  return (
    <>
    <div className="space-y-6">
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <DoctorProfileSummary doctor={doctor} totalPatients={doctorPatients.length} />
            <PatientsList patients={doctorPatients} />
        </div>
        <div className="lg:col-span-1">
            <DoctorCalendar 
                doctor={doctor} 
                appointments={doctorAppointments.filter(a => a.status === 'approved')} 
            />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Requests</CardTitle>
          <CardDescription>
            Review and manage incoming patient appointment requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorAppointments.length > 0 ? (
                doctorAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">
                      {appt.patientName}
                    </TableCell>
                    <TableCell>
                      {new Date(appt.date).toLocaleString()}
                    </TableCell>
                    <TableCell>{appt.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appt.status)} className="capitalize">
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {appt.status === 'pending' && (
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appt.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(appt.id, 'denied')}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Deny</span>
                          </Button>
                        </div>
                      )}
                      {appt.status === 'approved' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openCancelDialog(appt)}
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </Button>
                      )}
                       {appt.status === 'cancelled' && appt.cancellationReason && (
                        <p className="text-xs text-muted-foreground italic">Reason: {appt.cancellationReason}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    <CancellationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancel}
        actorName="Doctor"
     />
    </>
  );
}
