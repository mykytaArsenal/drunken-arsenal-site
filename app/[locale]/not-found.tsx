import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold">Mission Failed</h2>
          <p className="text-lg text-muted-foreground">
            The target you're looking for has been neutralized or never existed.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/">Return to Base</Link>
        </Button>
      </div>
    </div>
  );
}
