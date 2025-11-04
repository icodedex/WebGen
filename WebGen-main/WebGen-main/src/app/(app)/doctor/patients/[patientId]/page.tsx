
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { users, medicalRecords } from '@/lib/data';
import type { User, MedicalRecord, Appointment } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { User as UserIcon, FileText, Calendar, AlertTriangle, Pill, HeartPulse, ShieldCheck, ArrowLeft, Check, X, RefreshCw, Cake, Phone, Home, Droplets, Ruler, Weight } from 'lucide-react';
import { PMRViewer } from '@/components/doctor/pmr-viewer';
import { useAppointments } from '@/hooks/use-appointments';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { CancellationDialog } from '@/components/shared/cancellation-dialog';

function getStatusVariant(status: Appointment['status']) {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'denied':
        case 'cancelled':
            return 'destructive';
        case 'rescheduled': return 'outline';
        default: return 'outline';
    }
}

function PatientInfoCard({ patient, record }: { patient: User, record?: MedicalRecord }) {
    const personalInfo = [
        { icon: Phone, label: "Phone", value: patient.phone },
        { icon: Home, label: "Address", value: patient.address },
        { icon: Cake, label: "D.O.B", value: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A' },
        { icon: UserIcon, label: "Gender", value: patient.gender },
    ];
    
    const medicalInfo = [
        { icon: Droplets, label: "Blood Group", value: record?.bloodGroup },
        { icon: Ruler, label: "Height", value: record?.height ? `${record.height} cm` : 'N/A' },
        { icon: Weight, label: "Weight", value: record?.weight ? `${record.weight} kg` : 'N/A' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {personalInfo.map(item => (
                        <div key={item.label} className="flex items-start gap-3">
                            <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-sm">{item.value || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <Separator />
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {medicalInfo.map(item => (
                        <div key={item.label} className="flex items-start gap-3">
                            <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-sm">{item.value || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: doctor } = useAuth();
  const patientId = params.patientId as string;
  const { appointments, updateAppointmentStatus } = useAppointments();
  const { toast } = useToast();

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [suggestedDate, setSuggestedDate] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const patient = users.find(
    (user) => user.id === patientId && user.role === 'patient'
  ) as User | undefined;
  
  const record = medicalRecords.find(
    (r) => r.patientId === patientId
  ) as MedicalRecord | undefined;
  
  const patientAppointments = appointments.filter(
    (appt) => appt.patientId === patientId && appt.doctorId === doctor?.id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const openRescheduleDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSuggestedDate(new Date(appointment.date).toISOString().slice(0, 16));
    setIsRescheduleDialogOpen(true);
  }

  const handleRescheduleSubmit = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'rescheduled', { suggestedDate: new Date(suggestedDate).toISOString() });
      toast({
        title: 'Reschedule Request Sent',
        description: 'The patient has been notified of your reschedule request.'
      });
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
      setSuggestedDate('');
    }
  }

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

  if (!patient || !doctor) {
    return <div>Patient not found.</div>;
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
            <AvatarImage src={`https://avatar.vercel.sh/${patient.email}.png`} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
            <h1 className="text-3xl font-bold font-headline">{patient.name}</h1>
            <p className="text-muted-foreground">{patient.email}</p>
            </div>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft />
            Back
        </Button>
      </div>

      <PatientInfoCard patient={patient} record={record} />
      
      <div className="grid gap-6 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Personal Medical Records (PMR)
                </CardTitle>
                <CardDescription>
                Unlock and view patient-uploaded medical files using a secure access code.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PMRViewer patientId={patient.id} />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Records
            </CardTitle>
            <CardDescription>
              Patient's diagnoses, medications, and allergies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><HeartPulse className="h-4 w-4 text-primary" />Diagnoses</h3>
              <p className="text-sm text-muted-foreground">
                {record?.diagnoses?.join(', ') || 'No diagnoses on record.'}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Pill className="h-4 w-4 text-primary" />Medications</h3>
              <p className="text-sm text-muted-foreground">
                {record?.medications?.join(', ') || 'No medications on record.'}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-primary" />Allergies</h3>
              <p className="text-sm text-muted-foreground">
                {record?.allergies?.join(', ') || 'No allergies on record.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment History
            </CardTitle>
            <CardDescription>
              A log of all past and upcoming appointments with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientAppointments.length > 0 ? (
                  patientAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="font-medium">{appt.doctorName}</TableCell>
                      <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appt.status)} className="capitalize">
                            {appt.status}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                        {(appt.status === 'pending' || appt.status === 'rescheduled') && (
                          <div className="flex justify-end gap-2">
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
                             <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRescheduleDialog(appt)}
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only">Reschedule</span>
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
                          <p className="text-xs text-muted-foreground italic text-right">Reason: {appt.cancellationReason}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
    <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                    Suggest a new date and time for the appointment with {selectedAppointment?.patientName}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input 
                    type="datetime-local"
                    value={suggestedDate}
                    onChange={(e) => setSuggestedDate(e.target.value)}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleRescheduleSubmit}>Send Request</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
     <CancellationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancel}
        actorName="Doctor"
     />
    </>
  );
}
