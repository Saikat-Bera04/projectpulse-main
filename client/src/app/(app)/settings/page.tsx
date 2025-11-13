import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification preferences.</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="linked-accounts">Linked Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                This is where you can change your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Alex Durden" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="alex.durden@example.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="linked-accounts">
          <Card>
            <CardHeader>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>
                Connect your other accounts to streamline your workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Github className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">GitHub</p>
                    <p className="text-sm text-muted-foreground">Connected as @alexdurden</p>
                  </div>
                </div>
                <RainbowButton>Unlink</RainbowButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications from ProjectPulse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-updates">Task Updates</Label>
                  <p className="text-sm text-muted-foreground">When a task you're assigned to is updated.</p>
                </div>
                <Switch id="task-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="team-invites">Team Invites</Label>
                  <p className="text-sm text-muted-foreground">When someone invites you to a project.</p>
                </div>
                <Switch id="team-invites" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="review-reminders">Peer Review Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders to complete peer reviews.</p>
                </div>
                <Switch id="review-reminders" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <div className="flex justify-end mt-6">
            <RainbowButton>Save Changes</RainbowButton>
        </div>
    </div>
  );
}
