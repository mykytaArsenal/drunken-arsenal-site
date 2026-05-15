import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, Trophy, Users } from 'lucide-react';

export const metadata = {
  title: 'How to Play - Drunken Arsenal',
  description: 'Learn the rules of Shot Wave tactical drinking game',
};

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">How to Play Shot Wave</h1>
            <p className="text-xl text-muted-foreground">
              Master the tactical drinking battlefield in 3 easy steps
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    1. Deploy Your Forces
                  </h2>
                  <p className="text-muted-foreground">
                    Set up your artillery shells (shot glasses) in formation on
                    the battlefield. Each player positions their tactical mines
                    strategically to create obstacles.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    2. Engage the Enemy
                  </h2>
                  <p className="text-muted-foreground">
                    Take turns launching your shots. When you hit an opponent's
                    shell, they drink. Hit a mine? The whole squad takes a shot.
                    Strategy is key to victory.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">3. Claim Victory</h2>
                  <p className="text-muted-foreground">
                    Last player standing wins the battle. The defeated must
                    salute the victor and accept their fate as the party's
                    designated drink mixer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Rules */}
          <div className="mt-12 bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Important Rules</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">•</span>
                <span>Players must be 18+ to participate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">•</span>
                <span>Always drink responsibly and know your limits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">•</span>
                <span>Designate a sober driver before the mission begins</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">•</span>
                <span>
                  Stop playing if anyone feels uncomfortable or unwell
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/#products">Get Your Arsenal</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
