
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Calendar,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const patientNav: NavItem[] = [
  { href: '/patient/ai-chat', label: 'AI Chat', icon: Bot },
  { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/patient/profile', label: 'Medical Profile', icon: FileText },
  { href: '/patient/pmr', label: 'PMR', icon: ShieldCheck },
];

const doctorNav: NavItem[] = [];

const adminNav: NavItem[] = [];

const roleNavs = {
  patient: patientNav,
  doctor: doctorNav,
  admin: adminNav,
};

export function HeaderNav({ role }: { role: 'admin' | 'doctor' | 'patient' }) {
  const pathname = usePathname();
  const navItems = roleNavs[role] || [];

  const isActive = (href: string) => {
    if (href === '/doctor' || href === '/patient') {
      return pathname.startsWith(href) && (pathname === href || !pathname.startsWith(href + '/'));
    }
    return pathname === href;
  };

  return (
    <nav className="hidden items-center gap-4 md:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
