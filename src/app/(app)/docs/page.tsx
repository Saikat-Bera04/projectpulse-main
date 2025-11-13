import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCog,
  Search,
  FolderPlus,
  KanbanSquare,
  GitBranch,
  MessagesSquare,
  BarChart,
  ShieldCheck,
  Code,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';

export default function DocsPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: '1. Sign Up / Log In',
      content: [
        'Visit the ProjectPulse web application.',
        'Click on ‘Sign Up’ and choose GitHub or your institutional email.',
        'Use your credentials to log in and access the dashboard.',
        'Use GitHub login for automatic repo linking later.',
      ],
    },

    {
      icon: <UserCog className="h-6 w-6 text-primary" />,
      title: '2. Create Your Profile',
      content: [
        'Open the Profile tab from the sidebar.',
        'Fill in your skills, areas of interest, and availability.',
        'AI uses your profile for accurate team recommendations.',
        'Keep your profile updated for better matchmaking and analytics.',
      ],
    },

    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: '3. Find a Team',
      content: [
        'Go to the ‘Find Team’ section on the dashboard.',
        'View AI-generated teammate suggestions.',
        'Send or accept collaboration invites.',
        'Filter results by project type, skill level, or domain.',
      ],
    },

    {
      icon: <FolderPlus className="h-6 w-6 text-primary" />,
      title: '4. Create a Project',
      content: [
        'Click ‘Create Project’ on the main screen.',
        'Enter project title, description, and assign teammates.',
        'Automatically link or create a GitHub repository.',
        'Define milestones and task categories before starting.',
      ],
    },

    {
      icon: <KanbanSquare className="h-6 w-6 text-primary" />,
      title: '5. The Kanban Board',
      content: [
        'Use columns like To Do, In Progress, and Done to manage workflow.',
        'Add new tasks, assign owners, and set due dates.',
        'Drag & drop tasks between columns to update progress.',
        'Use filters to view assigned or completed tasks.',
        'Monitor task history and status updates in real time.',
      ],
    },

    {
      icon: <GitBranch className="h-6 w-6 text-primary" />,
      title: '6. GitHub Integration',
      content: [
        'Connect your GitHub account in settings.',
        'Every project auto-creates or connects to a GitHub repository.',
        'Commits, pull requests, and issues sync automatically.',
        'View commit messages and code activity inside ProjectPulse.',
      ],
    },

    {
      icon: <MessagesSquare className="h-6 w-6 text-primary" />,
      title: '7. Real-Time Collaboration',
      content: [
        'Chat with teammates directly in the workspace.',
        'Comment on tasks for quick discussions.',
        'Receive instant notifications for updates or mentions.',
        'No reloads — everything updates live via Socket.IO.',
      ],
    },

    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: '8. Analytics Dashboard',
      content: [
        'Track overall project progress.',
        'View milestone completion and task velocity.',
        'Check individual contributions.',
        'Identify workload distribution.',
        'Understand progress through charts.',
      ],
    },

    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: '9. Peer Review System',
      content: [
        'After each milestone, a peer review form appears.',
        'Rate teammates on communication, contribution, reliability.',
        'Ratings remain confidential and affect analytics.',
        'AI uses reviews to improve team matching.',
      ],
    },

    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: '10. VS Code Extension (Optional)',
      content: [
        'Install the ProjectPulse extension from VS Code Marketplace.',
        'Log in using ProjectPulse credentials.',
        'View Kanban tasks directly inside VS Code.',
        'Add or complete tasks without switching tabs.',
        'Commits sync automatically with GitHub.',
      ],
    },

    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: '11. General Tips',
      content: [
        'Update your profile regularly for accurate AI suggestions.',
        'Use meaningful task names and clear descriptions.',
        'Review analytics weekly to track productivity.',
        'Use peer reviews constructively for fairness and improvement.',
      ],
    },

    {
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      title: '12. Support & Troubleshooting',
      content: [
        'If tasks aren’t updating, refresh or check your internet.',
        'Fix GitHub sync issues by reauthenticating in settings.',
        'For login or account issues, use the Help tab or contact support.',
      ],
    },

    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: 'Technical Overview',
      content: [
        'Frontend: Next.js',
        'Backend: Node.js',
        'Database: PostgreSQL',
        'AI: OpenAI Embeddings for matchmaking',
        'Real-time: Socket.IO',
        'Auth: GitHub OAuth for secure authentication',
      ],
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">ProjectPulse — User Manual</h1>
        <p className="text-lg text-muted-foreground">
          A complete guide to using ProjectPulse effectively.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guide</CardTitle>
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
                  {Array.isArray(feature.content) ? (
                    <ul className="list-disc ml-6 space-y-1">
                      {feature.content.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-line">{feature.content}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
