import React from 'react';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F3F5F9] dark:bg-[#0E1117] text-clay-text antialiased font-sans relative">
        {/* Background Canvas (Fixed -z-10) */}
        <BackgroundCanvas />

        {/* Main Content Container (Relative z-10) */}
        <div id="page-scroll-container" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
