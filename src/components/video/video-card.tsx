
"use client";

import type { Video } from "@/types/video";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PlayCircle, Eye, ThumbsUp, MessageSquare, Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber, formatDuration } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
}

const tagsToFilter = ['music', 'code', 'nextjs'];
const qualityToFilter = ['1080p', '720p'];

export function VideoCard({ video }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video.previewVideoUrl && videoRef.current) {
      if (isHovering) {
        videoRef.current.currentTime = 0; // Reset video to start
        videoRef.current.play().catch(error => console.error("Error playing preview:", error));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovering, video.previewVideoUrl]);

  const displayTags = video.tags.filter(tag => !tagsToFilter.includes(tag.toLowerCase())).slice(0, 3);
  const displayQualities = video.quality.filter(q => !qualityToFilter.includes(q.toLowerCase()));

  return (
    <Link href={`/video/${video.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg h-full">
      <Card 
        className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg glass-effect h-full flex flex-col"
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
              aria-label={`Preview for ${video.title}`}
            />
          ) : (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={400}
              height={225}
              className="object-cover w-full h-full"
              data-ai-hint="video thumbnail"
              priority // Prioritize loading images visible in the viewport
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
          {isHovering && !video.previewVideoUrl && ( // Show play icon on hover if no preview video
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <PlayCircle className="w-16 h-16 text-white/80" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div>
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
              <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {formatNumber(video.views)} views</span>
              <span className="flex items-center"><ThumbsUp className="w-3 h-3 mr-1" /> {formatNumber(video.likes)}</span>
              <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" /> {formatNumber(video.comments.length)}</span>
            </div>
          </div>
          {(displayTags.length > 0 || displayQualities.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1">
              {displayTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
              {displayQualities.map((q) => (
                <Badge key={q} variant="secondary" className="text-xs">{q}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
