
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
import { Badge } from '@/components/ui/badge';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

function ChangePasswordForm() {
    const { user, login } = useAuth();
    const { updateUser } = useUsers();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (values: z.infer<typeof passwordSchema>) => {
        if (!user) return;
        
        if (values.currentPassword !== user.password) {
            form.setError('currentPassword', { message: 'Incorrect current password' });
            return;
        }

        const updatedUser = { ...user, password: values.newPassword, mustChangePassword: false };
        
        updateUser(user.id, { password: values.newPassword, mustChangePassword: false });
        login(updatedUser); // Update user in auth context

        toast({
            title: 'Password Updated',
            description: 'Your password has been changed successfully.',
        });
        
        if (user.mustChangePassword) {
            router.replace('/dashboard');
        } else {
            form.reset();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-6 w-6 text-primary" />
                    Change Your Password
                </CardTitle>
                 <CardDescription>
                    Update your password here. It's recommended to use a strong, unique password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                            <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                            <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            <ShieldCheck />
                            Update Password
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

function AdminProfileInfo({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="relative mx-auto w-fit">
          <Avatar className="h-28 w-28 border-4 border-background shadow-md">
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ProfilePictureUpload />
        </div>
        <CardTitle className="text-3xl mt-4 font-headline">{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <Badge className="capitalize text-lg">{user.role}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}


export default function AdminProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <UserIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <AdminProfileInfo user={user} />
                </div>
                <div className="lg:col-span-2">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
