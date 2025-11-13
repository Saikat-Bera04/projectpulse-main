
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Github, Linkedin, Mail, Pencil, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/hooks/use-profile-store";

export default function ProfilePage() {
  const { profile } = useProfileStore();

  const projects = [
    { name: "AI for Education", description: "Workspace for team collaboration and task management.", progress: 75 },
    { name: "Mobile App Dev", description: "Developing a new social media application.", progress: 40 },
  ];

  const userAvatar = PlaceHolderImages.find(img => img.id === profile.avatarId);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-28 h-28 mb-4 border-4 border-muted">
                <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-6 w-6" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              <Link href="/profile/edit" className="w-full mt-6">
                <RainbowButton className="w-full">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Your Profile
                </RainbowButton>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
              <CardDescription>A collection of skills and professional interests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Projects</CardTitle>
              <CardDescription>Projects where {profile.name.split(' ')[0]} is an active member.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map(project => (
                <div key={project.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                   <Link href="/project/1">
                    <RainbowButton>
                      <ArrowUpRight className="h-4 w-4" />
                    </RainbowButton>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
