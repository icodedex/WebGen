
'use client';

import type { User } from '@/lib/types';
import { users as initialUsers } from '@/lib/data';
import { createContext, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `${user.role}-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast({
        variant: 'destructive',
        title: 'User Removed',
        description: 'The user has been successfully removed from the system.'
    });
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, ...updates } : user));
  }

  return (
    <UserContext.Provider value={{ users, addUser, removeUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
