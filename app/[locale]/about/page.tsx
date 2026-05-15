import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Target, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us - Drunken Arsenal',
  description: 'Learn about the Drunken Arsenal mission',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">About Drunken Arsenal</h1>
            <p className="text-xl text-muted-foreground">
              Where tactical precision meets party perfection
            </p>
          </div>

          <div className="space-y-12">
            {/* Mission */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At Drunken Arsenal, we believe every party deserves
                    military-grade entertainment. We've taken the strategic
                    intensity of tactical operations and combined it with the
                    social fun of drinking games to create an unforgettable
                    experience. Our mission is to provide premium party gear
                    that transforms ordinary gatherings into legendary battles.
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Our Team</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Founded by a group of party commanders who were tired of
                    boring drinking games, Drunken Arsenal was born from a
                    simple idea: what if we could bring the strategy and
                    excitement of tactical games to social gatherings? Our team
                    combines expertise in game design, military history, and
                    professional partying to create products that are both fun
                    and built to last.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Our Values</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-foreground">
                        Responsible Fun:
                      </span>{' '}
                      We promote drinking responsibly and knowing your limits.
                      Every product comes with clear age restrictions and safety
                      guidelines.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-foreground">
                        Quality First:
                      </span>{' '}
                      Our products are built with tactical-grade materials to
                      withstand the most intense party operations.
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-foreground">
                        Community Driven:
                      </span>{' '}
                      We listen to our party commanders and continuously improve
                      our arsenal based on real-world battlefield feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Join the Mission?
            </h2>
            <p className="text-muted-foreground mb-6">
              Thousands of party commanders trust Drunken Arsenal for their
              tactical entertainment needs.
            </p>
            <Button size="lg" asChild>
              <Link href="/#products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
