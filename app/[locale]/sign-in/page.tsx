import { SignInForm } from '@/components/sign-in-form';
import { getCurrentUser } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In - Drunken Arsenal',
  description: 'Sign in to your account',
};

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <SignInForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{' '}
              </span>
              <Link
                href="/sign-up"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
