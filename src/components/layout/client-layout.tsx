"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

export function ClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/login', '/signup'];

  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      {showSidebar ? (
        <div className="flex flex-1 overflow-hidden"> {/* Added overflow-hidden to parent of sidebar and main content */}
          <AppSidebar />
          {/* SidebarInset is the <main> tag, apply padding and flex properties here */}
          <SidebarInset className={cn("p-4 md:p-6 lg:p-8 flex-1 flex flex-col overflow-auto")}>
              {/* Children are rendered directly. If they need specific layout, they should manage it or use a wrapper div. */}
              {children}
          </SidebarInset>
        </div>
      ) : (
        // For no-sidebar routes, main content takes full width below header
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      )}
    </div>
  );
}
