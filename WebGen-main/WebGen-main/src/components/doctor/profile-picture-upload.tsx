
'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

export function ProfilePictureUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and update the user's profile picture URL.
      // Here, we'll just show a toast message as a mock action.
      toast({
        title: 'Image Selected',
        description: `${file.name} is ready for upload. Feature coming soon!`,
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
        onClick={handleIconClick}
      >
        <Camera className="h-4 w-4" />
        <span className="sr-only">Change profile picture</span>
      </Button>
    </>
  );
}
