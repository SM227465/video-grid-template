"use client";

import { useState, useEffect } from 'react';
import type { Video } from "@/types/video";
import { VideoCard } from "@/components/video/video-card";
import { VideoPlayerModal } from "@/components/video/video-player-modal";
import { Button } from "@/components/ui/button";
import { Loader2, ListFilter, WifiOff } from "lucide-react";
import { recommendVideos, RecommendVideosInput } from '@/ai/flows/video-recommendations';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

// Mock video data
const mockVideos: Video[] = Array.from({ length: 12 }, (_, i) => ({
  id: `video${i + 1}`,
  title: `Awesome Video Title ${i + 1} - A Great Adventure`,
  description: `This is a detailed description for Awesome Video Title ${i + 1}. It covers various aspects of the topic and provides valuable insights. Enjoy watching! This content is for demonstration purposes. More details about the video are included to make the description longer. It's a really fantastic video that you will surely enjoy. Learn new things and expand your knowledge.`,
  thumbnailUrl: `https://picsum.photos/seed/${i + 1}/400/225`,
  videoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, // Placeholder
  previewVideoUrl: `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`, // Placeholder preview
  duration: Math.floor(Math.random() * 1800) + 300, // 5 to 30 minutes
  tags: ["tutorial", "tech", "nextjs", "code", "funny", "gaming", "music"].sort(() => 0.5 - Math.random()).slice(0, 3),
  quality: ["1080p", "720p"],
  uploadDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30), // Random date in last 30 days
  uploader: {
    id: `user${i % 3 + 1}`,
    name: ["TechGuru", "CodeMaster", "FunnyVids"][i % 3],
    avatarUrl: `https://avatar.vercel.sh/user${i % 3 + 1}.png`,
  },
  views: Math.floor(Math.random() * 100000) + 1000,
  likes: Math.floor(Math.random() * 5000) + 100,
  dislikes: Math.floor(Math.random() * 200) + 10,
  comments: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
    id: `comment${i}-${j}`,
    userId: `commenter${j}`,
    userName: `User ${j + 1}`,
    userAvatar: `https://avatar.vercel.sh/commenter${j}.png`,
    text: `This is a great video! Thanks for sharing. Comment ${j+1}`,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
    likes: Math.floor(Math.random() * 50),
    dislikes: Math.floor(Math.random() * 5),
  })),
  isPaid: i % 4 === 0, // Every 4th video is paid
}));


export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedVideosList, setRecommendedVideosList] = useState<Video[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const { userRole, isAuthenticated } = useAuth(); // Using mock watch history for demo
  const mockUserWatchHistory = ['video1', 'video3']; // Example video IDs

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1500);

    // Check online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };

  }, []);

  useEffect(() => {
    if (isAuthenticated && videos.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendedVideosList([]); // Clear recommendations if not authenticated or no videos
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, videos, userRole]);


  const fetchRecommendations = async () => {
    if (!isOnline) {
      setRecommendedVideosList([]);
      return;
    }
    setIsRecommendationsLoading(true);
    try {
      const input: RecommendVideosInput = {
        userWatchHistory: mockUserWatchHistory,
        allVideoIds: videos.map(v => v.id),
      };
      const result = await recommendVideos(input);
      const recommended = videos.filter(v => result.recommendedVideoIds.includes(v.id));
      setRecommendedVideosList(recommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedVideosList([]); // Fallback to empty or show an error
    } finally {
      setIsRecommendationsLoading(false);
    }
  };


  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <WifiOff className="w-24 h-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">You are offline</h2>
        <p className="text-muted-foreground">Please check your internet connection and try again.</p>
      </div>
    );
  }
  
  const VideoGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discover Videos</h1>
        <Button variant="outline">
          <ListFilter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {isLoading ? (
        <VideoGridSkeleton />
      ) : (
        <>
          {isRecommendationsLoading ? (
             <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
              <VideoGridSkeleton />
            </div>
          ) : recommendedVideosList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {recommendedVideosList.map((video) => (
                  <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                ))}
              </div>
              <hr className="my-8"/>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mb-4">All Videos</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No videos found.</p>
          )}
        </>
      )}

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Placeholder for pagination or infinite scroll */}
      {/* <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div> */}
    </div>
  );
}
