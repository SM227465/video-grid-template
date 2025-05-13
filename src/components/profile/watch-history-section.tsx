
"use client";

import { useState, useEffect } from 'react';
import type { Video } from "@/types/video";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoCard } from '@/components/video/video-card'; // Reusing VideoCard for consistent look
import { History, ListVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Using mockVideos similar to HomePageContent for demonstration
const mockVideosFull: Video[] = Array.from({ length: 24 }, (_, i) => ({ 
  id: `video${i + 1}`,
  title: `History Video ${i + 1}: An Epic Journey`,
  description: `This is a detailed description for History Video ${i + 1}.`,
  thumbnailUrl: `https://picsum.photos/seed/history${i + 1}/400/225`,
  videoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, 
  previewVideoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4`,
  duration: Math.floor(Math.random() * 900) + 300, // 5 to 20 minutes
  tags: ["history", "documentary", "learning"].slice(0, Math.floor(Math.random()*2)+1),
  quality: ["1080p", "720p"] as Video["quality"],
  uploadDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * (10 + i)), // Watched over the last month
  uploader: {
    id: `user${(i % 5) + 1}`,
    name: ["History Buff", "DocuWorld", "LearnTube", "PastExplorers", "TimeTraveler"][i % 5],
    avatarUrl: `https://avatar.vercel.sh/uploader${(i % 5) + 1}.png`,
  },
  views: Math.floor(Math.random() * 50000) + 1000,
  likes: Math.floor(Math.random() * 2000) + 50,
  dislikes: Math.floor(Math.random() * 100) + 5,
  comments: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
    id: `histcomment${i}-${j}`, userId: `user${j}`, userName: `Viewer ${j+1}`, text: `Great historical insight!`, timestamp: new Date(), likes: Math.floor(Math.random()*10), dislikes: 0
  })),
  isPaid: i % 5 === 0,
}));

// Simulate a user's watch history (array of video IDs)
const userWatchedVideoIds = mockVideosFull.slice(0, 10).map(v => v.id).reverse(); // Last 10 videos, reversed for newest first

export function WatchHistorySection() {
  const [watchedVideos, setWatchedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching watch history
    setIsLoading(true);
    setTimeout(() => {
      const history = userWatchedVideoIds
        .map(id => mockVideosFull.find(video => video.id === id))
        .filter(video => video !== undefined) as Video[];
      setWatchedVideos(history);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleClearHistory = () => {
    // Simulate clearing history
    setWatchedVideos([]);
    toast({
        title: "Watch History Cleared",
        description: "Your watch history has been cleared (simulated)."
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <History className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Watch History</CardTitle>
            </div>
            {watchedVideos.length > 0 && (
                 <Button variant="outline" size="sm" onClick={handleClearHistory}>Clear Watch History</Button>
            )}
        </div>
        <CardDescription>Videos you've recently watched on VidShare.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <div className="h-[160px] w-full rounded-xl bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : watchedVideos.length > 0 ? (
          <ScrollArea className="h-[600px] pr-4"> {/* Adjust height as needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchedVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ListVideo className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Your watch history is empty.</p>
            <p className="text-sm text-muted-foreground">Start watching videos to see them here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

