
'use client';

import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  HeartPulse,
  User as UserIcon,
} from 'lucide-react';
import { ProfilePictureUpload } from '@/components/doctor/profile-picture-upload';

function DoctorProfileCard({ doctor }: { doctor: User }) {
  const profileItems = [
    { icon: Briefcase, label: 'Experience', value: `${doctor.experience} years` },
    { icon: Star, label: 'Rating', value: `${doctor.rating}/5.0` },
    { icon: Clock, label: 'Available Hours', value: doctor.availableHours },
    { icon: DollarSign, label: 'Consultation Fee', value: `$${doctor.consultationFee}` },
    { icon: Award, label: 'License Number', value: doctor.licenseNumber },
    { icon: HeartPulse, label: 'Specialty', value: doctor.specialty },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-6 text-center">
        <div className="relative mx-auto w-fit">
          <Avatar className="h-28 w-28 border-4 border-background shadow-md">
            <AvatarImage src={`https://avatar.vercel.sh/${doctor.email}.png`} alt={doctor.name} />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ProfilePictureUpload />
        </div>
        <CardTitle className="text-3xl mt-4 font-headline">{doctor.name}</CardTitle>
        <CardDescription>{doctor.email}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center text-muted-foreground">Professional Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
               <div className="p-3 bg-primary/10 rounded-full">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-base">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DoctorProfilePage() {
  const { user: doctor } = useAuth();

  if (!doctor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
      </div>
      <DoctorProfileCard doctor={doctor} />
    </div>
  );
}
