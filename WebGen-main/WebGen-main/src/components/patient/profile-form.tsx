
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { medicalRecords } from '@/lib/data';
import type { MedicalRecord, User } from '@/lib/types';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormData = {
  // Personal
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  // Medical
  diagnoses: string;
  medications: string;
  allergies: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number;
  weight: number;
};

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      diagnoses: '',
      medications: '',
      allergies: '',
      height: 0,
      weight: 0,
    },
  });

  useEffect(() => {
    if (user) {
      const record = medicalRecords.find((r) => r.patientId === user.id);
      if (record) {
        reset({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          gender: user.gender,
          diagnoses: record.diagnoses.join(', '),
          medications: record.medications.join(', '),
          allergies: record.allergies.join(', '),
          bloodGroup: record.bloodGroup,
          height: record.height || 0,
          weight: record.weight || 0,
        });
      }
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    // In a real app, this would be a server action to update the database.
    // For this mock, we are not persisting changes.
    toast({
      title: 'Profile Updated',
      description: 'Your medical records have been saved.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Controller name="address" control={control} render={({ field }) => <Input id="address" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Controller name="dateOfBirth" control={control} render={({ field }) => <Input id="dateOfBirth" type="date" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
        
        <h3 className="text-lg font-semibold border-b pb-2 pt-4">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                         <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                    <SelectItem key={group} value={group}>{group}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Controller name="height" control={control} render={({ field }) => <Input id="height" type="number" {...field} />} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Controller name="weight" control={control} render={({ field }) => <Input id="weight" type="number" {...field} />} />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="diagnoses">Diagnoses</Label>
            <Controller name="diagnoses" control={control} render={({ field }) => <Textarea id="diagnoses" placeholder="e.g., Hypertension, Type 2 Diabetes" {...field} />} />
            <p className="text-sm text-muted-foreground">Please enter diagnoses separated by commas.</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="medications">Medications</Label>
            <Controller name="medications" control={control} render={({ field }) => <Textarea id="medications" placeholder="e.g., Lisinopril, Metformin" {...field} />} />
            <p className="text-sm text-muted-foreground">Please enter medications separated by commas.</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Controller name="allergies" control={control} render={({ field }) => <Textarea id="allergies" placeholder="e.g., Penicillin, Peanuts" {...field} />} />
            <p className="text-sm text-muted-foreground">Please enter allergies separated by commas.</p>
        </div>
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save />
            Save Changes
        </Button>
    </form>
  );
}
