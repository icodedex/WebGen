'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/hooks/use-appointments';
import type { Appointment } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
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
import { Check, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CancellationDialog } from '@/components/shared/cancellation-dialog';


export function AppointmentsList() {
  const { user } = useAuth();
  const { appointments, patientRespondToReschedule, updateAppointmentStatus } = useAppointments();
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newSuggestedDate, setNewSuggestedDate] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);


  useEffect(() => {
    if (user) {
      setPatientAppointments(
        appointments.filter((appt) => appt.patientId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  }, [user, appointments]);
  
  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'denied':
      case 'cancelled':
        return 'destructive';
      case 'rescheduled':
          return 'outline';
      default:
        return 'outline';
    }
  };

  const handleRescheduleResponse = (appointmentId: string, response: 'accept' | 'deny') => {
    patientRespondToReschedule(appointmentId, response);
    toast({
        title: `Request ${response === 'accept' ? 'Accepted' : 'Denied'}`,
        description: `The appointment has been updated.`
    });
  }

  const openRescheduleDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewSuggestedDate(new Date().toISOString().slice(0, 16));
    setIsRescheduleDialogOpen(true);
  }

  const handlePatientRescheduleSubmit = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'pending', { suggestedDate: new Date(newSuggestedDate).toISOString() });
      toast({
        title: 'Reschedule Request Sent',
        description: 'The doctor has been notified of your new suggested time.'
      });
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
    }
  }

  const handleCancelAppointment = (reason: string) => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'cancelled', { cancellationReason: reason });
      toast({
        variant: 'destructive',
        title: 'Appointment Cancelled',
        description: 'Your appointment has been successfully cancelled.'
      });
    }
  };

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };


  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Your Appointments</CardTitle>
        <CardDescription>
          Here is a list of your past and upcoming appointments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientAppointments.length > 0 ? (
                patientAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                        <TableCell className="font-medium">{appt.doctorName}</TableCell>
                        <TableCell>
                          {appt.status === 'rescheduled' && appt.suggestedDate ? (
                            <div className="flex flex-col">
                              <span className="line-through text-muted-foreground">{new Date(appt.date).toLocaleDateString()}</span>
                              <span className="font-semibold text-primary">{new Date(appt.suggestedDate).toLocaleString()} (New)</span>
                            </div>
                          ) : (
                            new Date(appt.date).toLocaleDateString()
                          )}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <Badge variant={getStatusVariant(appt.status)} className="capitalize w-fit">
                                    {appt.status}
                                </Badge>
                                {appt.status === 'cancelled' && appt.cancellationReason && (
                                    <p className="text-xs text-muted-foreground italic mt-1">Reason: {appt.cancellationReason}</p>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            {appt.status === 'rescheduled' && (
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleRescheduleResponse(appt.id, 'accept')}><Check /></Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleRescheduleResponse(appt.id, 'deny')}><X /></Button>
                                    <Button size="sm" variant="outline" onClick={() => openRescheduleDialog(appt)}><RefreshCw /></Button>
                                </div>
                            )}
                            {appt.status === 'approved' && (
                                <Button size="sm" variant="destructive" onClick={() => openCancelDialog(appt)}>
                                    <X className="h-4 w-4 mr-1"/>
                                    Cancel
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        You have no appointments.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Suggest New Time</DialogTitle>
                <DialogDescription>
                    Propose a new date and time for your appointment with {selectedAppointment?.doctorName}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input 
                    type="datetime-local"
                    value={newSuggestedDate}
                    onChange={(e) => setNewSuggestedDate(e.target.value)}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handlePatientRescheduleSubmit}>Send Request</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <CancellationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelAppointment}
        actorName="Patient"
     />

    </>
  );
}
