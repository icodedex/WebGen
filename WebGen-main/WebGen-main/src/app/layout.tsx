import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { AppointmentProvider } from '@/context/appointment-context';
import { UserProvider } from '@/context/user-context';

export const metadata: Metadata = {
  title: 'WebGen',
  description: 'Your trusted AI medical consultant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <UserProvider>
          <AuthProvider>
            <AppointmentProvider>
              {children}
              <Toaster />
            </AppointmentProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
