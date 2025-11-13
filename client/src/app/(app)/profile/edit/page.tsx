
"use client";

import { useState } from 'react';
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/hooks/use-profile-store';
import { useToast } from '@/hooks/use-toast';

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, setProfile } = useProfileStore();
  
  const [formData, setFormData] = useState(profile);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleUpdateProfile = () => {
    setProfile(formData);
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully.",
    });
    router.push('/profile');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Your Profile</h1>
            <p className="text-muted-foreground">Manage your public profile and skills.</p>
        </div>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" value={formData.linkedin} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input id="github" value={formData.github} onChange={handleInputChange} />
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills & Tags</CardTitle>
                    <CardDescription>Add tags that represent your skills and interests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="e.g., react, python, figma"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <RainbowButton onClick={handleAddTag}>Add Tag</RainbowButton>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-sm py-1 pl-3 pr-2">
                                    {tag}
                                    <button 
                                      onClick={() => handleRemoveTag(tag)} 
                                      className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                                      aria-label={`Remove ${tag}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
                <Link href="/profile">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <RainbowButton onClick={handleUpdateProfile}>Update Profile</RainbowButton>
            </div>
        </div>
    </div>
  );
}
