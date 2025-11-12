import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
      aria-label="ProjectPulse Logo"
    >
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 20 L20 100 L100 180 L180 100 Z" />
        <path d="M60 100 L100 60 L140 100 L100 140 Z" />
        <path d="M100 60 L100 20" />
        <path d="M100 140 L100 180" />
        <path d="M60 100 L20 100" />
        <path d="M140 100 L180 100" />
        
        <path d="M80 80 L80 120" />
        <path d="M80 80 H120 V120 H80" />
        
        <path d="M120 120 L120 80" />
      </g>
      <text 
        x="100" 
        y="105" 
        fill="currentColor" 
        fontSize="14" 
        fontFamily="sans-serif" 
        textAnchor="middle" 
        transform="rotate(-45 100 100)"
      >
        PROJECTPULSE
      </text>
    </svg>
  );
}
