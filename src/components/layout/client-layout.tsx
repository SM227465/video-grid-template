
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SidebarSkeleton = () => (
  // This skeleton is primarily for desktop view as mobile sidebar is a sheet.
  // Use typical sidebar widths as placeholders.
  <div 
    className="hidden md:flex flex-col p-2 border-r bg-sidebar text-sidebar-foreground space-y-4 h-full"
    // Attempt to use CSS variables if available, otherwise use fixed widths
    // style={{ width: 'var(--sidebar-width, 16rem)' }} // More dynamic approach
    // Simplified approach:
    style={{ width: '256px' }} // Corresponds to w-64 typically used for sidebar
  >
    {/* Header/Logo placeholder */}
    <Skeleton className="h-12 w-full mb-4" />
    {/* Nav items placeholders */}
    <Skeleton className="h-9 w-full" />
    <Skeleton className="h-9 w-full" />
    <Skeleton className="h-9 w-full" />
    <Skeleton className="h-9 w-full" />
    {/* Separator */}
    <Skeleton className="h-px w-full my-4" />
    {/* Group/Label placeholder */}
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    {/* Footer items placeholders */}
    <div className="mt-auto space-y-2">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);


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
          <Suspense fallback={<SidebarSkeleton />}>
            <AppSidebar />
          </Suspense>
          {/* SidebarInset is the <main> tag, apply padding and flex properties here */}
          <SidebarInset className={cn("p-4 md:p-6 lg:p-8 flex-1 flex flex-col overflow-auto")}>
              {/* Children are rendered directly. If they need specific layout, they should manage it or use a wrapper div. */}
              {children}
          </SidebarInset>
        </div>
      ) : (
        // For no-sidebar routes, main content takes full width below header
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto h-full">
          {children}
        </main>
      )}
    </div>
  );
}

