
"use client";

import { RainbowButton } from '@/components/magicui/rainbow-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, MoveRight, Layers, BarChart, Users } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { TerminalComponent } from '@/components/magicui/terminal';
import CardNav, { type CardNavItem } from '@/components/shared/CardNav';
import { ParticleTextEffect } from '@/components/shared/ParticleTextEffect';
import { BentoDemo } from '@/components/demos/bento-demo';
import MarqueeDemo from '@/components/demos/marquee-demo';
import { AnimatedCTASection } from '@/components/shared/AnimatedCTASection';
import { Footer } from '@/components/shared/Footer';
import { useRef } from 'react';
import { PricingSection } from '@/components/shared/PricingSection';

export default function Home() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'AI Teammate Matching',
      description:
        'Our AI analyzes skills and learning styles to recommend the perfect project partners.',
    },
    {
      icon: <Layers className="h-8 w-8 text-primary" />,
      title: 'Project Workspace & Kanban',
      description:
        'Organize tasks, track progress, and collaborate seamlessly with an integrated Kanban board.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Analytics & Peer Review',
      description:
        "Gain insights into your team's contributions and grow with constructive peer feedback.",
    },
  ];

  const navItems: CardNavItem[] = [
    {
      label: 'Features',
      bgColor: '#000000',
      textColor: '#fff',
      links: [
        {
          label: 'AI Teammate Matching',
          href: '/team-match',
          ariaLabel: 'AI Teammate Matching feature',
        },
        {
          label: 'Project Workspace',
          href: '/project/1',
          ariaLabel: 'Project Workspace feature',
        },
        {
          label: 'Analytics',
          href: '/analytics',
          ariaLabel: 'Analytics feature',
        },
      ],
    },
    {
      label: 'Dashboard',
      bgColor: '#000000',
      textColor: '#fff',
      links: [
        { label: 'Login', href: '/login', ariaLabel: 'Login to dashboard' },
        { label: 'Sign Up', href: '/signup', ariaLabel: 'Sign up' },
      ],
    },
    {
      label: 'Resources',
      bgColor: '#000000',
      textColor: '#fff',
      links: [
        {
          label: 'Documentation',
          href: '/docs',
          ariaLabel: 'Read documentation',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CardNav
        logo="/logo.svg"
        items={navItems}
        baseColor="rgba(255, 255, 255, 0.5)"
        menuColor="black"
        buttonBgColor="#29ABE2"
        buttonTextColor="white"
      />
      <main className="flex-1">
        <section className="w-full h-[80vh]">
          <div className="w-full h-full relative flex items-center justify-center">
            <ParticleTextEffect
              words={['PROJECT', 'PULSE', 'INNOVATE', 'COLLABORATE']}
            />
            <div className="flex flex-col items-center space-y-4 text-center absolute top-1/2 -translate-y-1/2 mt-16 px-4 md:px-6">
              <p className="mx-auto max-w-[700px] text-foreground font-bold text-2xl md:text-3xl">
                ProjectPulse uses AI to build your dream team, manage your
                workflow, and deliver results.
              </p>
              <div className="space-x-4">
                <Link href="/signup">
                  <RainbowButton>
                    <Github className="mr-2 h-5 w-5" /> Login with GitHub
                  </RainbowButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full pb-4">
          <MarqueeDemo />
        </section>
        <section id="features" className="w-full bg-transparent">
          <div className="w-full px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Collaborate Smarter, Not Harder
                  </h2>
                  <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Everything you need to succeed in one platform. From finding
                    a team to tracking your progress.
                  </p>
                </div>
              </div>
              <BentoDemo />
            </div>
          </div>
        </section>
        <section ref={terminalRef} className="w-full py-6 px-4 md:px-6">
          <div className="">
            <TerminalComponent containerRef={terminalRef} />
          </div>
        </section>
        <PricingSection />
        <AnimatedCTASection />
      </main>
      <Footer />
    </div>
  );
}
