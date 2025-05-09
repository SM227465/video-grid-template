
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Video, VideoComment } from "@/types/video";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, PlusSquare, MessageSquare, Eye, Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, formatDuration } from "@/lib/utils";

// Re-use mockVideos from home page for now - ideally this would come from a service or API
const mockVideos: Video[] = Array.from({ length: 12 }, (_, i) => ({
  id: `video${i + 1}`,
  title: `Awesome Video Title ${i + 1} - A Great Adventure`,
  description: `This is a detailed description for Awesome Video Title ${i + 1}. It covers various aspects of the topic and provides valuable insights. Enjoy watching! This content is for demonstration purposes. More details about the video are included to make the description longer. It's a really fantastic video that you will surely enjoy. Learn new things and expand your knowledge. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This is a sample description for video ${i + 1}. We explore exciting topics and share knowledge.`,
  thumbnailUrl: `https://picsum.photos/seed/${i + 1}/400/225`,
  videoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, 
  previewVideoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`,
  duration: Math.floor(Math.random() * 1800) + 300, 
  tags: ["tutorial", "tech", "nextjs", "code", "funny", "gaming", "music", "lifestyle", "travel", "vlog"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2),
  quality: ["1080p", "720p", "480p"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1) as Video["quality"],
  uploadDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30), 
  uploader: {
    id: `user${i % 3 + 1}`,
    name: ["TechGuru", "CodeMaster", "FunnyVids"][i % 3],
    avatarUrl: `https://avatar.vercel.sh/user${i % 3 + 1}.png`,
  },
  views: Math.floor(Math.random() * 1000000) + 1000,
  likes: Math.floor(Math.random() * 50000) + 100,
  dislikes: Math.floor(Math.random() * 2000) + 10,
  comments: Array.from({ length: Math.floor(Math.random() * 15) + 1 }, (_, j) => ({
    id: `comment${i}-${j}`,
    userId: `commenter${j % 5 + 1}`,
    userName: `User ${j % 5 + 1}`, // Example user names
    userAvatar: `https://avatar.vercel.sh/commenter${j % 5 + 1}.png`,
    text: `This is a great video! Thanks for sharing. Comment ${j+1}. Really insightful and well-made. Looking forward to more content like this from you. Keep up the good work!`,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * (j + 1)), // Spread comments over time
    likes: Math.floor(Math.random() * 150),
    dislikes: Math.floor(Math.random() * 20),
  })),
  isPaid: i % 4 === 0, 
}));


export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<VideoComment[]>([]);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setTimeout(() => {
        const foundVideo = mockVideos.find(v => v.id === videoId);
        if (foundVideo) {
          setVideo(foundVideo);
          setComments(foundVideo.comments ? [...foundVideo.comments].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : []);
        } else {
          console.error("Video not found");
        }
        setIsLoading(false);
      }, 500);
    }
  }, [videoId]);

  const handleAddComment = () => {
    if (newComment.trim() && video) {
      const comment: VideoComment = {
        id: String(Date.now()),
        userId: "currentUser", 
        userName: "You", 
        userAvatar: `https://avatar.vercel.sh/you.png`,
        text: newComment,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto py-8 text-center">
         <Button variant="outline" onClick={() => router.back()} className="mb-4 absolute top-20 left-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-semibold mt-16">Video Not Found</h2>
        <p className="text-muted-foreground">The video you are looking for does not exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to videos
        </Button>
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16 / 9} className="mb-4 rounded-lg overflow-hidden shadow-xl bg-black">
            <video 
              key={video.id} // Add key to force re-render if video source changes
              src={video.videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full"
              poster={video.thumbnailUrl}
            />
          </AspectRatio>

          <Card className="shadow-lg rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{video.title}</CardTitle>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 flex items-center flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center"><Eye className="mr-1.5 h-4 w-4" /> {formatNumber(video.views)} views</span>
                <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> Uploaded {new Date(video.uploadDate).toLocaleDateString()}</span>
                <span className="flex items-center"><ThumbsUp className="mr-1.5 h-4 w-4" /> {formatNumber(video.likes)} likes</span>
                <span className="flex items-center"><MessageSquare className="mr-1.5 h-4 w-4" /> {formatNumber(comments.length)} comments</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1 py-4 border-y">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={video.uploader.avatarUrl || `https://avatar.vercel.sh/${video.uploader.name}.png`} alt={video.uploader.name} />
                    <AvatarFallback>{video.uploader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-md sm:text-lg">{video.uploader.name}</p>
                    <p className="text-xs text-muted-foreground">1.2M subscribers</p> 
                  </div>
                  <Button variant="default" size="sm">Subscribe</Button>
                </div>
                <div className="flex items-center space-x-1 self-start sm:self-center">
                  <Button variant="ghost" size="sm"><ThumbsUp className="mr-1 h-4 w-4" /> Like</Button>
                  <Button variant="ghost" size="sm"><ThumbsDown className="mr-1 h-4 w-4" /> Dislike</Button>
                  <Button variant="ghost" size="sm"><Share2 className="mr-1 h-4 w-4" /> Share</Button>
                  <Button variant="ghost" size="sm"><PlusSquare className="mr-1 h-4 w-4" /> Save</Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/40 rounded-md">
                <h4 className="font-semibold text-md mb-1.5">Description</h4>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80">{video.description}</p>
                {(video.tags.length > 0 || video.quality.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-muted">
                        <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">Tags & Quality</h5>
                        <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                        {video.quality.map((q) => (
                            <Badge key={q} variant="outline" className="text-xs">{q}</Badge>
                        ))}
                        </div>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="border-b pb-3">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                Comments ({formatNumber(comments.length)})
              </h3>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4">
                <Textarea
                  placeholder="Add a public comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-sm"
                  rows={2}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="mt-2 w-full sm:w-auto">
                  Comment
                </Button>
              </div>
              <ScrollArea className="h-[300px] sm:h-[450px] lg:h-[calc(100vh_-_var(--header-height,_4rem)_-_var(--comments-fixed-height,_20rem))] pr-1"> {/* Adjust height dynamically or fixed */}
                <div className="space-y-5">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
                        <AvatarImage src={comment.userAvatar || `https://avatar.vercel.sh/${comment.userName}.png`} alt={comment.userName} />
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold">{comment.userName} <span className="text-xs text-muted-foreground ml-1 font-normal">{new Date(comment.timestamp).toLocaleTimeString([], { day: 'numeric', month:'short', hour: '2-digit', minute: '2-digit' })}</span></p>
                        <p className="text-sm mt-0.5 text-foreground/90">{comment.text}</p>
                        <div className="flex items-center space-x-1 mt-1.5 text-xs text-muted-foreground">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsUp className="w-3 h-3" /></Button>
                          <span className="text-xs">{formatNumber(comment.likes)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1"><ThumbsDown className="w-3 h-3" /></Button>
                           <Button variant="ghost" size="sm" className="text-xs ml-2">Reply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
