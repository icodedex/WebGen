
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/hooks/use-appointments';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Bot, Calendar, FileText, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function WelcomeHeader() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find(p => p.id === 'patient-dashboard-hero');
  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl font-bold font-headline text-white">{getGreeting()}, {user.name}!</h1>
                <p className="text-white/90">Here's a summary of your health dashboard.</p>
            </div>
        </div>
    </Card>
  );
}

const QuickLink = ({ href, icon: Icon, title, description }: { href: string, icon: React.ElementType, title: string, description: string }) => (
    <Link href={href} className="block hover:bg-muted/50 rounded-lg p-4 transition-colors">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto self-center" />
        </div>
    </Link>
);


function UpcomingAppointments() {
    const { user } = useAuth();
    const { appointments } = useAppointments();

    const upcoming = appointments
        .filter(a => a.patientId === user?.id && a.status === 'approved' && new Date(a.date) > new Date())
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your next scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                {upcoming.length > 0 ? (
                    <div className="space-y-4">
                        {upcoming.map(appt => (
                            <div key={appt.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={`https://avatar.vercel.sh/${appt.doctorName}.png`} alt={appt.doctorName} />
                                        <AvatarFallback>{appt.doctorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{appt.doctorName}</p>
                                        <p className="text-sm text-muted-foreground">{format(new Date(appt.date), "EEE, MMM d 'at' h:mm a")}</p>
                                    </div>
                                </div>
                                <Badge variant="default">Approved</Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p>
                )}
                 <Button asChild className="w-full mt-4">
                    <Link href="/patient/appointments">View All Appointments</Link>
                </Button>
            </CardContent>
        </Card>
    )

}

export default function PatientDashboardPage() {

    const quickLinks = [
        { href: '/patient/ai-chat', icon: Bot, title: 'AI Medical Advisor', description: 'Get quick advice for your health questions.' },
        { href: '/patient/appointments', icon: Calendar, title: 'Manage Appointments', description: 'Schedule, view, and reschedule appointments.' },
        { href: '/patient/profile', icon: FileText, title: 'Update Medical Profile', description: 'Keep your health records up to date.' },
        { href: '/patient/pmr', icon: ShieldCheck, title: 'Share Medical Records', description: 'Securely share your files with doctors.' },
    ];


  return (
    <div className="space-y-6">
        <WelcomeHeader />
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {quickLinks.map(link => <QuickLink key={link.href} {...link} />)}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <UpcomingAppointments />
            </div>
        </div>
    </div>
  );
}
