
import Link from 'next/link';
import { Stethoscope, Linkedin, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-headline">WebGen</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WebGen. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
             <a href="mailto:thakkararchi3@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email for suggestions</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-muted-foreground">
            <p>For inquiries, please contact us at <a href="mailto:thakkararchi3@gmail.com" className="text-primary hover:underline">thakkararchi3@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
}
