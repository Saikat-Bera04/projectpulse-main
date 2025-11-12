
"use client"
import React, { useEffect, useState, useMemo } from 'react';

const PATH_COUNT = 24;

interface PathData {
  d: string;
  strokeWidth: number;
  style: React.CSSProperties;
}

const generatePathData = (isFlipped: boolean): PathData[] => {
  return Array.from({ length: PATH_COUNT }).map((_, i) => {
    const d = isFlipped
      ? `M${1076 - i * 5} -189C${1076 - i * 5} -189 ${1008 - i * 5} 216 ${544 - i * 5} 343C${80 - i * 5} 470 ${12 - i * 5} 875 ${12 - i * 5} 875`
      : `M${-380 - i * 5} -189C${-380 - i * 5} -189 ${-312 - i * 5} 216 ${152 - i * 5} 343C${616 - i * 5} 470 ${684 - i * 5} 875 ${684 - i * 5} 875`;

    const dashArray = `${Math.random() * 80 + 60} ${Math.random() * 80 + 60}`;
    const duration = `${Math.random() * 12 + 8}s`;
    const delay = `${Math.random() * 10}s`;
    const animationName = isFlipped ? `travelPathFlipped-${i}` : `travelPath-${i}`;

    return {
      d,
      strokeWidth: 0.8 + i * 0.02,
      style: {
        strokeDasharray: dashArray,
        opacity: 0.6 + i * 0.02,
        animation: `${animationName} ${duration} linear infinite`,
        animationDelay: delay,
      },
    };
  });
};

const FloatingPaths: React.FC<{ position: 1 | -1; isFlipped?: boolean }> = ({ position, isFlipped = false }) => {
  const [paths, setPaths] = useState<PathData[]>([]);

  useEffect(() => {
    setPaths(generatePathData(isFlipped));
  }, [isFlipped]);

  const keyframes = useMemo(() => {
    return paths.map((_, i) => {
      const animationName = isFlipped ? `travelPathFlipped-${i}` : `travelPath-${i}`;
      return `
        @keyframes ${animationName} {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 400; }
        }
      `;
    }).join('\n');
  }, [paths, isFlipped]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <style jsx>{keyframes}</style>
      <svg viewBox="0 0 696 316" fill="none" className="w-full h-full">
        {paths.map((path, i) => (
          <g key={i}>
            <path d={path.d} stroke="none" fill="none" />
            <path
              d={path.d}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={path.strokeWidth}
              fill="none"
              style={path.style}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export const BackgroundPaths = () => {
  return (
    <>
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <FloatingPaths position={1} isFlipped />
        <FloatingPaths position={-1} isFlipped />
      </div>
    </>
  );
};

