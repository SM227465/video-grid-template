"use client";

import type { Video } from "@/types/video";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { PlayCircle, Eye, ThumbsUp, MessageSquare, Clock, Film, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userRole } = useAuth();
  const { toast } = useToast();

  const canPlayDirectly = userRole === "paid_user" || !video.isPaid;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
      h > 0 ? h : null,
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const handlePlayClick = () => {
    if (canPlayDirectly) {
      onPlay(video);
    } else {
      // Show "watch ad" prompt
      toast({
        title: "Watch Ad to Play",
        description: "This is a premium video. Watch a short ad to continue.",
        action: (
          <Button onClick={() => {
            toast({ title: "Ad Skipped (Demo)", description: "Playing video..." });
            onPlay(video);
          }}>
            Watch Ad (Demo)
          </Button>
        ),
      });
    }
  };
  
  useEffect(() => {
    if (isHovering && videoRef.current && video.previewVideoUrl) {
      videoRef.current.currentTime = 0; // Reset video to start
      videoRef.current.play().catch(error => console.error("Error playing preview:", error));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovering, video.previewVideoUrl]);


  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg glass-effect"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="p-0 relative aspect-video">
        {isHovering && video.previewVideoUrl ? (
           <video
            ref={videoRef}
            src={video.previewVideoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline // Important for mobile compatibility
          />
        ) : (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={400}
            height={225}
            className="object-cover w-full h-full"
            data-ai-hint="video thumbnail"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="bg-black/50 text-white text-xs py-1 px-2">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(video.duration)}
            </Badge>
            {video.isPaid && <Badge variant="destructive" className="text-xs py-1 px-2"><Film className="w-3 h-3 mr-1" /> Premium</Badge>}
          </div>
        </div>
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30 cursor-pointer" onClick={handlePlayClick}>
            <PlayCircle className="w-16 h-16 text-white/80" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold leading-tight mb-2 truncate group-hover:text-primary transition-colors">
          {video.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src={video.uploader.avatarUrl || `https://avatar.vercel.sh/${video.uploader.name}.png`} alt={video.uploader.name} />
            <AvatarFallback>{video.uploader.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{video.uploader.name}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground space-x-3">
          <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {video.views.toLocaleString()} views</span>
          <span className="flex items-center"><ThumbsUp className="w-3 h-3 mr-1" /> {video.likes.toLocaleString()}</span>
          <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" /> {video.comments.length}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {video.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {video.quality.map((q) => (
             <Badge key={q} variant="secondary" className="text-xs">{q}</Badge>
          ))}
        </div>
      </CardContent>
       <CardFooter className="p-4 pt-0">
        <Button onClick={handlePlayClick} className="w-full" variant={canPlayDirectly ? "default" : "outline"}>
          {canPlayDirectly ? <PlayCircle className="mr-2 h-4 w-4" /> : <Film className="mr-2 h-4 w-4" />}
          {canPlayDirectly ? "Play Video" : "Watch Ad to Play"}
        </Button>
      </CardFooter>
    </Card>
  );
}
