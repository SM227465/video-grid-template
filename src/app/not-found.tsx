
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,4rem)-var(--footer-height,0rem)-2*var(--main-padding,2rem))] text-center p-4 md:p-8">
      <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-2">Page Not Found</h2>
      <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or perhaps you mistyped the URL.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
      <div className="mt-12">
        <p className="text-sm text-muted-foreground">If you believe this is an error, please <Link href="/contact" className="text-primary hover:underline">contact support</Link>.</p>
      </div>
    </div>
  );
}
