
import { Suspense } from 'react';
import HomePageContent from '@/components/layout/home-page-content';
import { Skeleton } from '@/components/ui/skeleton';

// Define a skeleton loader for the entire page content while Suspense is waiting
const PageSkeleton = () => (
  <div className="container mx-auto">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-28" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-[250px]" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </div>
        </div>
      ))}
    </div>
     <div className="flex justify-center items-center space-x-4 mt-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
    </div>
  </div>
);


export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
