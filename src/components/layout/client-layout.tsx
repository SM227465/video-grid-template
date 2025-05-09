"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset } from "@/components/ui/sidebar";

export function ClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/login', '/signup'];

  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showSidebar ? (
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      ) : (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      )}
    </div>
  );
}
