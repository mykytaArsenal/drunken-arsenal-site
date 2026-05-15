import { getCurrentUser } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/[locale]/actions/auth';
import { User, Package, LogOut } from 'lucide-react';

export const metadata = {
  title: 'My Account - Drunken Arsenal',
  description: 'Manage your account',
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Your account information
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">Orders</h2>
                  <p className="text-sm text-muted-foreground">
                    View your order history
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                Track your tactical gear deliveries and view past orders.
              </p>

              <Button variant="outline" className="w-full" disabled>
                View Orders (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-8">
            <form action={signOutAction}>
              <Button type="submit" variant="destructive" size="lg">
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
