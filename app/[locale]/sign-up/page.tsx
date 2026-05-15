import { SignUpForm } from '@/components/sign-up-form';
import { getCurrentUser } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up - Drunken Arsenal',
  description: 'Create your account',
};

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Join the Arsenal</h1>
            <p className="text-muted-foreground">
              Create an account to track orders and more
            </p>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-sm font-bold text-destructive text-center">
              You must be 18+ to create an account
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <SignUpForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{' '}
              </span>
              <Link
                href="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
