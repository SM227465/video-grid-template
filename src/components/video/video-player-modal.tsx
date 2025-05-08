"use client";

import type { Video } from "@/types/video";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, PlusSquare, MessageSquare, Eye, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from 'react';

interface VideoPlayerModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(video?.comments || []);

  if (!video) return null;

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: String(Date.now()),
        userId: "currentUser", // Replace with actual user ID
        userName: "Current User", // Replace with actual user name
        userAvatar: `https://avatar.vercel.sh/currentuser.png`,
        text: newComment,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-2">
            <AspectRatio ratio={16 / 9}>
              <video src={video.videoUrl} controls autoPlay className="w-full h-full bg-black" />
            </AspectRatio>
            <div className="p-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{video.title}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {video.views.toLocaleString()} views</span>
                  <span className="flex items-center ml-3"><Clock className="w-4 h-4 mr-1.5" /> Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between mt-4 py-2 border-y">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={video.uploader.avatarUrl || `https://avatar.vercel.sh/${video.uploader.name}.png`} alt={video.uploader.name} />
                    <AvatarFallback>{video.uploader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{video.uploader.name}</p>
                    <p className="text-xs text-muted-foreground">1.2M subscribers</p> {/* Placeholder */}
                  </div>
                  <Button variant="outline" size="sm">Subscribe</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1.5" /> {video.likes.toLocaleString()}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ThumbsDown className="w-4 h-4 mr-1.5" /> {video.dislikes.toLocaleString()}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <PlusSquare className="w-4 h-4 mr-1.5" /> Save
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-secondary/50 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{video.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                  {video.quality.map((q) => (
                    <Badge key={q} variant="outline" className="text-xs">{q}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col border-l bg-background/50">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments ({comments.length})
              </h3>
            </div>
            <ScrollArea className="flex-1 h-[calc(100vh-300px)] md:h-auto"> {/* Adjust height as needed */}
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                       <AvatarImage src={comment.userAvatar || `https://avatar.vercel.sh/${comment.userName}.png`} alt={comment.userName} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{comment.userName} <span className="text-xs text-muted-foreground ml-1">{new Date(comment.timestamp).toLocaleTimeString()}</span></p>
                      <p className="text-sm">{comment.text}</p>
                       <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsUp className="w-3 h-3" /></Button>
                        <span>{comment.likes}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsDown className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
                 {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No comments yet.</p>}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-sm"
                  rows={2}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
