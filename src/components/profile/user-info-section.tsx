
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserInfoSection() {
  const { userName, userRole, setUserRole } = useAuth(); // Assuming email is not directly in auth context
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simulate fetching email - in a real app this would come from auth or API
  const userEmail = userName ? `${userName.toLowerCase().replace(/\s/g, '')}@example.com` : 'user@example.com';

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = () => {
    if (previewAvatar) {
      // In a real app, you would upload the avatar to a server here
      // For demo, we'll just show a success toast
      // And potentially update the auth context if avatarUrl is stored there
      toast({
        title: 'Avatar Updated',
        description: 'Your new avatar has been set (locally).',
      });
      // If your useAuth().setUserRole or a similar function can update avatar in context:
      // setUserRole(userRole, userName, previewAvatar); 
    } else {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image file to upload.',
        variant: 'destructive',
      });
    }
  };

  const currentAvatarSrc = previewAvatar || (userName ? `https://avatar.vercel.sh/${userName.replace(/\s/g, '')}.png?text=${userName.charAt(0).toUpperCase()}` : `https://avatar.vercel.sh/user.png?text=U`);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Personal Information</CardTitle>
        </div>
        <CardDescription>View and update your personal details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-primary/20 shadow-md">
              <AvatarImage src={currentAvatarSrc} alt={userName || 'User avatar'} />
              <AvatarFallback className="text-4xl">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change avatar"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{userName || 'VidShare User'}</h2>
            <p className="text-muted-foreground">{userEmail}</p>
            <p className="text-sm text-primary font-medium mt-1 capitalize">
              {userRole?.replace('_', ' ')}
            </p>
            {previewAvatar && (
                <Button onClick={handleUploadAvatar} size="sm" className="mt-3">
                    Upload New Avatar
                </Button>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
           <div>
            <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
            <Input id="displayName" type="text" defaultValue={userName || ''} className="mt-1" disabled />
             <p className="text-xs text-muted-foreground mt-1">Your display name is how you appear on VidShare.</p>
          </div>
           <div>
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input id="email" type="email" defaultValue={userEmail} className="mt-1" disabled />
            <p className="text-xs text-muted-foreground mt-1">Your email address is used for login and notifications. To change it, go to Account Settings.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
