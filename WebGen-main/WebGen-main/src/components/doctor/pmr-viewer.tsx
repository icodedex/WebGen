
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { pmrData } from '@/lib/data';
import type { PMRFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, File, AlertTriangle, ExternalLink, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function FileViewer({ file, onClose }: { file: PMRFile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-11/12 h-5/6 bg-white rounded-lg overflow-hidden flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/50 hover:bg-white text-black"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close File Viewer</span>
        </Button>
        {file.type === 'pdf' ? (
          <iframe src={file.url} className="w-full h-full" title={file.name} />
        ) : (
          <div className="relative w-full h-full">
            <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PMRViewer({ patientId }: { patientId: string }) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [files, setFiles] = useState<PMRFile[]>([]);
  const [viewingFile, setViewingFile] = useState<PMRFile | null>(null);
  const { toast } = useToast();
  
  const storageKey = `pmr-unlocked-${patientId}`;

  useEffect(() => {
    const checkSessionStorage = () => {
        const storedAccess = sessionStorage.getItem(storageKey);
        if (storedAccess) {
            const { expiresAt } = JSON.parse(storedAccess);
            if (new Date(expiresAt) > new Date()) {
                const pmr = pmrData.find((p) => p.patientId === patientId);
                if (pmr) {
                    setFiles(pmr.files);
                    setUnlocked(true);
                }
            } else {
                sessionStorage.removeItem(storageKey);
            }
        }
    };
    checkSessionStorage();
  }, [patientId, storageKey]);

  const handleUnlock = () => {
    setError('');
    const pmr = pmrData.find((p) => p.patientId === patientId);

    if (
      pmr &&
      pmr.accessCode &&
      pmr.accessCode.code === accessCode &&
      new Date(pmr.accessCode.expiresAt) > new Date()
    ) {
      setFiles(pmr.files);
      setUnlocked(true);
      
      sessionStorage.setItem(storageKey, JSON.stringify({ expiresAt: pmr.accessCode.expiresAt }));

      toast({ title: 'Access Granted', description: "You can now view the patient's files." });
    } else {
      setError('Invalid or expired access code. Please try again.');
    }
  };

  const handleViewFile = (file: PMRFile) => {
    setViewingFile(file);
  };

  if (unlocked) {
    return (
      <div>
        <h3 className="font-semibold mb-4">Patient Medical Files</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length > 0 ? (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-4 w-4 text-primary" />
                    {file.name}
                  </TableCell>
                  <TableCell className="capitalize">{file.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewFile(file)}>
                      <ExternalLink className="h-3 w-3 mr-1"/>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  This patient has no files.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card text-card-foreground p-6">
      <h3 className="font-semibold">Access Patient's PMR</h3>
      <p className="text-sm text-muted-foreground">
        Enter the unique code provided by the patient to unlock their medical files.
      </p>
      <div className="flex items-start gap-2">
        <Input
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="font-mono tracking-widest"
        />
        <Button onClick={handleUnlock}>
          <KeyRound />
          Unlock
        </Button>
      </div>
       {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
       )}
    </div>
  );
}
