
'use client';

import { motion, useInView } from 'framer-motion';
import { FC, ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSpanProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const AnimatedSpan: FC<AnimatedSpanProps> = ({
  children,
  className,
  delay = 0,
  containerRef,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef ?? ref, { once: true, amount: 0.1 });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={cn('block', className)}
    >
      {children}
    </motion.span>
  );
};

interface TypingAnimationProps {
  children: string;
  className?: string;
  delay?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  children,
  className,
  delay = 0,
  containerRef,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef ?? ref, { once: true, amount: 0.1 });
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isInView) {
      const typingSpeed = 50;
      let i = 0;
      const interval = setInterval(() => {
        if (i < children.length) {
          setText((prev) => prev + children.charAt(i));
          i++;
        } else {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, typingSpeed);
      return () => clearInterval(interval);
    }
  }, [isInView, children]);

  return (
    <AnimatedSpan className={className} delay={delay} containerRef={containerRef}>
      <span ref={ref}>
        {text}
        {showCursor && (
          <span className="inline-block w-2 h-5 bg-foreground animate-pulse" />
        )}
      </span>
    </AnimatedSpan>
  );
};

interface TerminalProps {
  children: ReactNode;
  className?: string;
}

const Terminal: FC<TerminalProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'w-full max-w-2xl mx-auto rounded-lg bg-card border shadow-lg p-4 font-code text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2 pb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export function TerminalComponent({ containerRef }: { containerRef?: React.RefObject<HTMLDivElement>}) {
  return (
    <Terminal>
      <TypingAnimation containerRef={containerRef}>&gt; pnpm dlx shadcn-ui@latest init</TypingAnimation>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={0.5}>
        ✔ Preflight checks.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={0.7}>
        ✔ Verifying framework. Found Next.js.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={0.9}>
        ✔ Validating Tailwind CSS.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={1.1}>
        ✔ Validating import alias.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={1.3}>
        ✔ Writing components.json.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={1.5}>
        ✔ Checking registry.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={1.7}>
        ✔ Updating tailwind.config.ts
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={1.9}>
        ✔ Updating app/globals.css
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-green-500" delay={2.1}>
        ✔ Installing dependencies.
      </AnimatedSpan>
      <AnimatedSpan containerRef={containerRef} className="text-blue-500" delay={2.3}>
        <span>ℹ Updated 1 file:</span>
        <span className="pl-2">- lib/utils.ts</span>
      </AnimatedSpan>
      <TypingAnimation containerRef={containerRef} className="text-muted-foreground" delay={2.8}>
        Success! Project initialization completed.
      </TypingAnimation>
      <TypingAnimation containerRef={containerRef} className="text-muted-foreground" delay={3.3}>
        You may now add components.
      </TypingAnimation>
    </Terminal>
  );
}

export { AnimatedSpan, TypingAnimation, Terminal };
