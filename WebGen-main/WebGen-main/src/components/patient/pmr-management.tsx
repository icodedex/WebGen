
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { pmrData } from '@/lib/data';
import type { PMRFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { File, Upload, KeyRound, Copy, RefreshCw } from 'lucide-react';

export function PMRManagement() {
  const { user } = useAuth();
  const [files, setFiles] = useState<PMRFile[]>([]);
  const [accessCode, setAccessCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [validityDays, setValidityDays] = useState(0);
  const [validityHours, setValidityHours] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const pmr = pmrData.find((p) => p.patientId === user.id);
      if (pmr) {
        setFiles(pmr.files);
        if (pmr.accessCode && new Date(pmr.accessCode.expiresAt) > new Date()) {
          setAccessCode(pmr.accessCode);
        }
      }
    }
  }, [user]);

  const handleGenerateCode = () => {
    // In a real app, this would be a server action.
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const totalMilliseconds = (validityDays * 24 * 60 * 60 * 1000) + (validityHours * 60 * 60 * 1000);
    if (totalMilliseconds <= 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid Duration',
            description: 'Please set a duration greater than 0.'
        });
        return;
    }

    const expiry = new Date(Date.now() + totalMilliseconds);
    const newAccessCode = { code: newCode, expiresAt: expiry.toISOString() };

    setAccessCode(newAccessCode);
    
    // Mocking the update in our data source
    const pmr = pmrData.find((p) => p.patientId === user?.id);
    if (pmr) {
      pmr.accessCode = newAccessCode;
    }

    toast({
      title: 'Access Code Generated',
      description: `The code is valid for ${validityDays} day(s) and ${validityHours} hour(s).`,
    });
  };
  
  const handleCopyCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode.code);
      toast({ title: 'Code Copied!' });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input type="file" disabled />
                <Button disabled><Upload /> Upload</Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">File upload is disabled in this demo.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length > 0 ? (
                  files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2"><File className="h-4 w-4 text-primary"/>{file.name}</TableCell>
                      <TableCell className="capitalize">{file.type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No files uploaded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grant Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a unique, temporary code to grant a doctor access to your
            medical records.
          </p>
          {accessCode && new Date(accessCode.expiresAt) > new Date() ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={accessCode.code}
                  readOnly
                  className="font-mono text-lg tracking-widest text-center"
                />
                <Button size="icon" variant="outline" onClick={handleCopyCode}><Copy /></Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Expires at: {new Date(accessCode.expiresAt).toLocaleString()}
              </p>
               <Button onClick={handleGenerateCode} className="w-full">
                <RefreshCw />
                Regenerate Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="days">Days</Label>
                        <Input 
                            id="days"
                            type="number" 
                            min="0"
                            value={validityDays}
                            onChange={(e) => setValidityDays(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hours">Hours</Label>
                        <Input 
                            id="hours"
                            type="number" 
                            min="0"
                            max="23"
                            value={validityHours}
                            onChange={(e) => setValidityHours(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <Button onClick={handleGenerateCode} className="w-full">
                <KeyRound />
                Generate Access Code
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
