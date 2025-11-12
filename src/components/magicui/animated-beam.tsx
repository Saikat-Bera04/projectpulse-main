"use client";

import React, {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Magic UI component, copied from https://magicui.design/docs/components/animated-beam
interface AnimatedBeamProps extends React.ComponentProps<"svg"> {
  containerRef: React.RefObject<HTMLElement>; // The container of the AnimatedBeam
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  onAnimationComplete?: (...args: any[]) => any;
  onAnimationStart?: (...args: any[]) => any;
}

export const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  delay = 0,
  duration = 3,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  onAnimationComplete,
  onAnimationStart,
  ...props
}: AnimatedBeamProps) => {
  const id = useId();
  const [pathD, setPathD] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const updatePath = () => {
        if (containerRef.current && fromRef.current && toRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const fromRect = fromRef.current.getBoundingClientRect();
          const toRect = toRef.current.getBoundingClientRect();

          const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
          const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
          const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
          const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

          const controlX = (startX + endX) / 2 - (endY - startY) * curvature;
          const controlY = (startY + endY) / 2 + (endX - startX) * curvature;

          setPathD(`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
        }
      };

      // Initial path calculation
      updatePath();

      // Recalculate on resize
      const resizeObserver = new ResizeObserver(updatePath);
      resizeObserver.observe(containerRef.current!);
      resizeObserver.observe(fromRef.current!);
      resizeObserver.observe(toRef.current!);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isMounted, containerRef, fromRef, toRef, startXOffset, startYOffset, endXOffset, endYOffset, curvature]);


  if (!pathD) {
    return null;
  }
  
  const [startX, startY] = pathD.split(' Q ')[0].substring(2).split(' ').map(Number);

  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu",
        className,
      )}
      {...props}
    >
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={startX}
          y1={startY}
          x2={startX}
          y2={startY}
        >
          <stop stopColor={gradientStartColor} />
          <stop offset="1" stopColor={gradientStopColor} />
        </motion.linearGradient>
      </defs>
      <motion.path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <motion.circle
        cx={startX}
        cy={startY}
        r={pathWidth / 2}
        fill={`url(#${id})`}
        stroke={pathColor}
        strokeWidth={pathWidth}
      >
        <animateMotion dur={`${duration}s`} path={pathD} repeatCount="indefinite" />
      </motion.circle>
    </svg>
  );
};