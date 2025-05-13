
// "use client" directive will be added by the bundler or transpiler if necessary for usePathname
// For now, let's assume it's managed by Next.js's app router conventions for layouts
// If direct client hooks are used, then "use client" would be needed at the top.

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { ClientLayout } from '@/components/layout/client-layout'; // ClientLayout is now wrapped
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from 'react'; // Added Suspense

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VidShare - Share & Discover Videos',
  description: 'A modern video sharing platform built with Next.js.',
};

// A simple fallback component for Suspense
const LayoutFallback = () => (
  <div className="flex flex-col min-h-screen w-full items-center justify-center bg-background text-foreground">
    <p>Loading page content...</p>
    {/* You could add a spinner or a minimal skeleton here if desired */}
  </div>
);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              <Suspense fallback={<LayoutFallback />}>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </Suspense>
            </SidebarProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
