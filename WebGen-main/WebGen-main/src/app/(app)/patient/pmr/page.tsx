import { PMRManagement } from '@/components/patient/pmr-management';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PMRPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">
          Personal Medical Records (PMR)
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Medical Files</CardTitle>
          <CardDescription>
            Upload and manage your medical history. You can generate a
            time-sensitive code to share your records with a doctor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PMRManagement />
        </CardContent>
      </Card>
    </div>
  );
}
