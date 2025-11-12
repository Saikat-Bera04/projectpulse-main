
"use client";

import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiFirebase,
  SiGooglecloud,
  SiGithub,
  SiVercel,
  SiTypescript
} from "react-icons/si";

const logos = [
  { icon: <SiNextdotjs className="h-10 w-10 text-black dark:text-white" />, name: "Next.js" },
  { icon: <SiReact className="h-10 w-10 text-[#61DAFB]" />, name: "React" },
  { icon: <SiTypescript className="h-10 w-10 text-[#3178C6]" />, name: "TypeScript" },
  { icon: <SiTailwindcss className="h-10 w-10 text-[#06B6D4]" />, name: "Tailwind CSS" },
  { icon: <SiFirebase className="h-10 w-10 text-[#FFCA28]" />, name: "Firebase" },
  { icon: <SiGooglecloud className="h-10 w-10 text-[#4285F4]" />, name: "Google Cloud" },
  { icon: <SiGithub className="h-10 w-10 text-black dark:text-white" />, name: "GitHub" },
  { icon: <SiVercel className="h-10 w-10 text-black dark:text-white" />, name: "Vercel" },
];

const MarqueeDemo = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg py-10">
      <Marquee pauseOnHover className="[--duration:20s]">
        {logos.map((logo, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center justify-center w-40 h-24 mx-4 cursor-pointer",
              "transition-transform duration-300 ease-in-out hover:scale-110"
            )}
            title={logo.name}
          >
            {logo.icon}
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeDemo;
