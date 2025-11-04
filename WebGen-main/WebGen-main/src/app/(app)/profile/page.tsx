
'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfilePictureUpload } from '@/components/doctor/profile-picture-upload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is a generic profile page. Redirect to role-specific profile page.
export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            switch (user.role) {
                case 'admin':
                    router.replace('/admin/profile');
                    break;
                case 'doctor':
                    router.replace('/doctor/profile');
                    break;
                case 'patient':
                    router.replace('/patient/profile');
                    break;
                default:
                    // Fallback or maybe a generic page for undefined roles
                    break;
            }
        }
    }, [user, isLoading, router]);


    if (!user) return null;

    return (
        <div>Redirecting to your profile...</div>
    );
}
