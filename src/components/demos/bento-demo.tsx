
"use client";

import { CalendarIcon, FileTextIcon } from "lucide-react" 
import { BellIcon, Share2Icon } from "lucide-react"
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils" 
import { Calendar } from "@/components/ui/calendar" 
import { AnimatedBeamMultipleOutputDemo } from "@/components/demos/animated-beam-multiple-outputs" 
import { AnimatedListDemo } from "@/components/demos/animated-list-demo" 
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid" 
import { Marquee } from "@/components/magicui/marquee" 

const files = [
   {
     name: "teammate1.json",
     body: "Skill-based matching for a frontend developer with React and TypeScript expertise.",
   },
   {
     name: "teammate2.json",
     body: "Interest-based matching for a designer passionate about mobile UI/UX.",
   },
   {
     name: "teammate3.json",
     body: "Availability-based matching for a backend engineer available part-time.",
   },
   {
     name: "teammate4.json",
     body: "Complementary skills match for a full-stack developer and a data scientist.",
   },
   {
     name: "teammate5.json",
     body: "Project needs match for a DevOps engineer for CI/CD setup.",
   },
 ]
  
 export function BentoDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Set the date only on the client to avoid hydration mismatch
    setSelectedDate(new Date());
  }, []);
  
  const features = [
    {
      Icon: FileTextIcon,
      name: "AI Teammate Matching",
      description: "Our AI analyzes skills and learning styles to recommend the perfect project partners.",
      href: "/team-match",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Project Workspace & Kanban",
      description: "Organize tasks, track progress, and collaborate seamlessly.",
      href: "/project/1",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
    {
      Icon: Share2Icon,
      name: "Analytics & Peer Review",
      description: "Gain insights into your team's contributions and grow with constructive peer feedback.",
      href: "/analytics",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute top-4 right-2 h-[300px] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "GitHub Integration",
      description: "Sync your project tasks with GitHub issues.",
      className: "col-span-3 lg:col-span-1",
      href: "/project/1",
      cta: "Learn more",
      background: (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="absolute top-10 right-0 origin-top scale-75 rounded-md border [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90"
        />
      ),
    },
  ]
   return (
     <BentoGrid>
       {features.map((feature, idx) => (
         <BentoCard key={idx} {...feature} />
       ))}
     </BentoGrid>
   )
 }
 

