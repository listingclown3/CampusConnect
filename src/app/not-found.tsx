import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-1">Page not found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-[#0055A2] px-6 py-3 text-sm font-medium text-white hover:bg-[#003d75] transition-colors min-h-[44px]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
