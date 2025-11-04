
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/use-users';
import type { User } from '@/lib/types';
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
import { Stethoscope, User as UserIcon, PlusCircle, Trash2, Search } from 'lucide-react';
import { AddUserDialog } from '@/components/admin/add-user-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


function UserTable({
  title,
  description,
  icon: Icon,
  data,
  onAdd,
  onRemove,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  data: User[];
  onAdd: () => void;
  onRemove: (userId: string) => void;
}) {
  const router = useRouter();
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRowClick = (userId: string) => {
    router.push(`/admin/${userId}`);
  };

  const filteredData = data.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <Button onClick={onAdd} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {title.slice(0, -1)}
            </Button>
          </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                {title === 'Doctors' && <TableHead>Specialty</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((user) => (
                <TableRow key={user.id} onClick={() => handleRowClick(user.id)} className="cursor-pointer">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {title === 'Doctors' && (
                    <TableCell>
                      <Badge variant="secondary">{user.specialty}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserToRemove(user)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the user {userToRemove?.name} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (userToRemove) {
                  onRemove(userToRemove.id)
                }
                setUserToRemove(null);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminPage() {
  const { users, addUser, removeUser } = useUsers();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState<'doctor' | 'patient'>('patient');

  const doctors = users.filter((user) => user.role === 'doctor');
  const patients = users.filter((user) => user.role === 'patient');
  
  const handleOpenAddDialog = (role: 'doctor' | 'patient') => {
    setRoleToAdd(role);
    setIsAddUserDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-1">
          <UserTable
            title="Doctors"
            description="Manage all doctors in the system."
            icon={Stethoscope}
            data={doctors}
            onAdd={() => handleOpenAddDialog('doctor')}
            onRemove={removeUser}
          />
          <UserTable
            title="Patients"
            description="View all registered patients."
            icon={UserIcon}
            data={patients}
            onAdd={() => handleOpenAddDialog('patient')}
            onRemove={removeUser}
          />
        </div>
      </div>
      <AddUserDialog 
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onAddUser={addUser}
        role={roleToAdd}
      />
    </>
  );
}
