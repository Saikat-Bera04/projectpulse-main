
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Code, Users, Briefcase, BarChart, GitBranch, Settings } from 'lucide-react';
  
  export default function DocsPage() {
    const features = [
      {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: 'Profile Creation & Management',
        content:
          'Create and customize your profile by adding your skills, interests, and links to your professional networks like GitHub and LinkedIn. A well-crafted profile helps our AI find the best teammates for you.',
      },
      {
        icon: <Code className="h-6 w-6 text-primary" />,
        title: 'AI Teammate Matching',
        content:
          'Our intelligent matching algorithm analyzes profiles to suggest teammates with complementary skills and shared interests. Browse through AI-curated suggestions to build your dream team.',
      },
      {
        icon: <Briefcase className="h-6 w-6 text-primary" />,
        title: 'Project Workspace & Kanban Board',
        content:
          'Each project has a dedicated workspace with a Kanban board (To Do, In Progress, Done) to manage tasks. Create tasks, assign them to teammates, and track progress visually.',
      },
      {
        icon: <GitBranch className="h-6 w-6 text-primary" />,
        title: 'GitHub Integration',
        content:
          'Connect your GitHub account to sync your project tasks with GitHub issues. Keep your codebase and project management in perfect harmony without switching between platforms.',
      },
      {
        icon: <BarChart className="h-6 w-6 text-primary" />,
        title: 'Analytics & Peer Review',
        content:
          "Monitor your team's performance with our analytics dashboard, which tracks task velocity and contribution breakdowns. Use the peer review system to provide and receive constructive feedback.",
      },
      {
        icon: <Settings className="h-6 w-6 text-primary" />,
        title: 'Settings & Customization',
        content:
          'Manage your account settings, notification preferences, and linked accounts from the settings page. Customize your experience to fit your workflow.',
      },
    ];
  
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">How to Use ProjectPulse</h1>
          <p className="text-lg text-muted-foreground">
            Your guide to collaborating and building amazing projects.
          </p>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {features.map((feature, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <span className="text-lg font-medium">{feature.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 text-base">
                    {feature.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }
  