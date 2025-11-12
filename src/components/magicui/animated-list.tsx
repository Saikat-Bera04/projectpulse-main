"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const AnimatedList = React.memo(
  ({
    className,
    children,
    delay = 1000,
  }: {
    className?: string;
    children: React.ReactNode;
    delay?: number;
  }) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);

    const itemsToShow = useMemo(() => {
      const start = index;
      const end = start + 10;
      if (end > childrenArray.length) {
        return [
          ...childrenArray.slice(start, childrenArray.length),
          ...childrenArray.slice(0, end - childrenArray.length),
        ];
      }
      return childrenArray.slice(start, end);
    }, [index, childrenArray]);

    return (
      <div
        className={cn("relative flex h-full flex-col gap-4 overflow-y-auto")}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <motion.div
              key={(item as ReactElement).key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";
