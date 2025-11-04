
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
import { medicalRecords } from '@/lib/data';
import type { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  KeyRound,
  User as UserIcon,
  HeartPulse,
  Pill,
  AlertTriangle,
  Star,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  Edit,
  Save,
  X,
  Cake,
  Phone,
  Home,
  Droplets,
  Ruler,
  Weight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { users, updateUser } = useUsers();
  const { toast } = useToast();

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  const userId = params.userId as string;
  const user = users.find((u) => u.id === userId);
  
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const patientRecord =
    user?.role === 'patient'
      ? medicalRecords.find((r) => r.patientId === userId)
      : null;

  const handleResetPassword = () => {
    if (!user) return;

    const newPassword = Math.random().toString(36).slice(-8);
    updateUser(user.id, {
      password: newPassword,
      mustChangePassword: true,
    });

    toast({
      title: 'Password Reset',
      description: `${user.name}'s new password is: ${newPassword}`,
      duration: 10000,
    });
    setIsResetDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user) return;
    updateUser(user.id, formData);
    setIsEditing(false);
    toast({
      title: 'User Updated',
      description: 'The user details have been saved successfully.',
    });
  };

  const handleCancel = () => {
    if (user) {
      setFormData(user);
    }
    setIsEditing(false);
  };

  if (!user) {
    return <div>User not found.</div>;
  }
  
  const renderDetail = (label: string, value: any, key: keyof User, type: 'text' | 'number' | 'date' = 'text') => {
    if (isEditing) {
      return (
        <div className="grid gap-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
                id={key}
                name={key}
                type={type}
                value={formData[key] as string || ''}
                onChange={handleInputChange}
            />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value}</dd>
        </div>
      </div>
    );
  };
  
  const renderSelectDetail = (label: string, value: any, key: keyof User, options: string[]) => {
      if (isEditing) {
          return (
            <div className="grid gap-2">
                <Label htmlFor={key}>{label}</Label>
                <Select value={formData[key] as string || ''} onValueChange={(val) => handleSelectChange(key, val)}>
                    <SelectTrigger><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
                    <SelectContent>
                        {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          )
      }
       return (
          <div className="flex items-center gap-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value}</dd>
            </div>
          </div>
        );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${user.email}.png`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                  {user.name}
                  <Badge
                    variant={user.role === 'doctor' ? 'default' : 'secondary'}
                    className="capitalize text-sm"
                  >
                    {user.role}
                  </Badge>
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                User Details
              </CardTitle>
              <CardDescription>
                Review user information and manage their account.
              </CardDescription>
            </div>
             {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit />
                Edit User
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {user.role === 'doctor' && (
              <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                {renderDetail('Name', formData.name, 'name')}
                {renderDetail('Email', formData.email, 'email')}
                {renderDetail('Experience', `${formData.experience || 0} years`, 'experience', 'number')}
                {renderDetail('Rating', `${formData.rating || 0}/5.0`, 'rating', 'number')}
                {renderDetail('Available Hours', formData.availableHours, 'availableHours')}
                {renderDetail('Consultation Fee', `$${formData.consultationFee || 0}`, 'consultationFee', 'number')}
                {renderDetail('License Number', formData.licenseNumber, 'licenseNumber')}
                {renderDetail('Specialty', formData.specialty, 'specialty')}
              </dl>
            )}
            {user.role === 'patient' && (
              <div className="space-y-8">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                 <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                    {renderDetail('Name', formData.name, 'name')}
                    {renderDetail('Email', formData.email, 'email')}
                    {renderDetail('Phone', formData.phone, 'phone')}
                    {renderDetail('Address', formData.address, 'address')}
                    {renderDetail('Date of Birth', formData.dateOfBirth, 'dateOfBirth', 'date')}
                    {renderSelectDetail('Gender', formData.gender, 'gender', ['Male', 'Female', 'Other'])}
                 </dl>

                 <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-muted p-3 rounded-md w-full">
                            <Droplets className="h-5 w-5 text-primary" />
                            <div><p className="font-semibold">{patientRecord?.bloodGroup}</p><p className="text-xs text-muted-foreground">Blood Group</p></div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-3 rounded-md w-full">
                            <Ruler className="h-5 w-5 text-primary" />
                            <div><p className="font-semibold">{patientRecord?.height} cm</p><p className="text-xs text-muted-foreground">Height</p></div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-3 rounded-md w-full">
                            <Weight className="h-5 w-5 text-primary" />
                            <div><p className="font-semibold">{patientRecord?.weight} kg</p><p className="text-xs text-muted-foreground">Weight</p></div>
                        </div>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2 mb-2"><HeartPulse className="h-4 w-4 text-primary" />Diagnoses</h3>
                      <p className="text-sm text-muted-foreground">{patientRecord?.diagnoses?.join(', ') || 'No diagnoses on record.'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2 mb-2"><Pill className="h-4 w-4 text-primary" />Medications</h3>
                      <p className="text-sm text-muted-foreground">{patientRecord?.medications?.join(', ') || 'No medications on record.'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-primary" />Allergies</h3>
                      <p className="text-sm text-muted-foreground">{patientRecord?.allergies?.join(', ') || 'No allergies on record.'}</p>
                    </div>
                  </div>
              </div>
            )}
          </CardContent>
           {isEditing && (
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save />
                  Save Changes
                </Button>
              </CardFooter>
            )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-destructive" />
              Account Actions
            </CardTitle>
            <CardDescription>
              Perform administrative actions on this user's account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Reset Password</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a new temporary password for the user. They will be
                  required to change it on their next login.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsResetDialogOpen(true)}
              >
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the password for {user.name}. They will be logged
              out of all sessions and will need to use the new password to log
              in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
