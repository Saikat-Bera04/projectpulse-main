
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Filter, UserPlus } from "lucide-react";

export default function TeamMatchPage() {
  const teammates = [
    { name: "Sarah Miller", role: "Frontend Developer", score: 92, avatarId: "avatar2" },
    { name: "David Chen", role: "AI Engineer", score: 88, avatarId: "avatar3" },
    { name: "Maria Garcia", role: "UI/UX Designer", score: 85, avatarId: "avatar4" },
    { name: "John Smith", role: "Backend Developer", score: 95, avatarId: "avatar1" },
    { name: "Emily White", role: "Product Manager", score: 89, avatarId: "avatar2" },
    { name: "Michael Brown", role: "DevOps Engineer", score: 82, avatarId: "avatar3" },
  ];

  return (
    <div className="w-full relative overflow-hidden px-4 md:px-6">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-500/20 rounded-full filter blur-3xl opacity-50 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-400/20 rounded-full filter blur-3xl opacity-50 -z-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-10 right-1/3 w-72 h-72 bg-red-300/20 rounded-full filter blur-3xl opacity-50 -z-10 animate-pulse animation-delay-4000"></div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Team Match</h1>
        <p className="text-muted-foreground">Find the perfect collaborators for your next project.</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
            <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Filters</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Filter by skills (e.g., React, Python...)" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by interests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="webdev">Web Development</SelectItem>
                <SelectItem value="gamedev">Game Development</SelectItem>
                <SelectItem value="ai-engineer">AI Engineer</SelectItem>
                <SelectItem value="ui-ux">UI/UX Designer</SelectItem>
                <SelectItem value="product-manager">Product Manager</SelectItem>
                <SelectItem value="devops">DevOps Engineer</SelectItem>
                <SelectItem value="data-scientist">Data Scientist</SelectItem>
                <SelectItem value="mobile-dev">Mobile Development</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time (10-20 hrs/week)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teammates.map((teammate) => {
          const avatar = PlaceHolderImages.find(img => img.id === teammate.avatarId);
          return (
            <Card key={teammate.name}>
              <CardHeader className="items-center">
                <Avatar className="w-24 h-24 border-4 border-muted">
                  <AvatarImage src={avatar?.imageUrl} data-ai-hint={avatar?.imageHint} />
                  <AvatarFallback>{teammate.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle>{teammate.name}</CardTitle>
                <CardDescription>{teammate.role}</CardDescription>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <p className="text-2xl font-bold text-primary">{teammate.score}%</p>
                </div>
              </CardContent>
              <CardFooter>
                <RainbowButton className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </RainbowButton>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
