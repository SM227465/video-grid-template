
"use client";

import { useState, useEffect } from 'react';
import type { Video } from "@/types/video";
import { VideoCard } from "@/components/video/video-card";
import { Button } from "@/components/ui/button";
import { ListFilter, WifiOff, ChevronLeft, ChevronRight } from "lucide-react";
import { recommendVideos, RecommendVideosInput } from '@/ai/flows/video-recommendations';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

// Mock video data
const mockVideos: Video[] = Array.from({ length: 24 }, (_, i) => ({ // Increased mock data for pagination
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
    userName: `User ${j % 5 + 1}`,
    userAvatar: `https://avatar.vercel.sh/commenter${j % 5 + 1}.png`,
    text: `This is a great video! Thanks for sharing. Comment ${j+1}. Really insightful and well-made. Looking forward to more content like this from you. Keep up the good work!`,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * (j + 1)),
    likes: Math.floor(Math.random() * 150),
    dislikes: Math.floor(Math.random() * 20),
  })),
  isPaid: i % 4 === 0,
}));

const VIDEOS_PER_PAGE = 8;

export default function Home() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedVideosList, setRecommendedVideosList] = useState<Video[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { userRole, isAuthenticated } = useAuth(); 
  const mockUserWatchHistory = ['video1', 'video3']; 

  useEffect(() => {
    setTimeout(() => {
      setAllVideos(mockVideos);
      setIsLoading(false);
    }, 1500);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); 

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };

  }, []);

  useEffect(() => {
    if (isAuthenticated && allVideos.length > 0 && isOnline) {
      fetchRecommendations();
    } else {
      setRecommendedVideosList([]); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, allVideos, userRole, isOnline]);


  const fetchRecommendations = async () => {
    if (!isOnline || allVideos.length === 0) {
      setRecommendedVideosList([]);
      return;
    }
    setIsRecommendationsLoading(true);
    try {
      const input: RecommendVideosInput = {
        userWatchHistory: mockUserWatchHistory,
        allVideoIds: allVideos.map(v => v.id),
      };
      const result = await recommendVideos(input);
      const recommended = allVideos.filter(v => result.recommendedVideoIds.includes(v.id));
      setRecommendedVideosList(recommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedVideosList([]); 
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const totalPages = Math.ceil(allVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = allVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
      {Array.from({ length: VIDEOS_PER_PAGE }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-[250px]" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
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
              <VideoGridSkeleton /> {/* Can use a smaller skeleton for recommendations if desired */}
            </div>
          ) : recommendedVideosList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {recommendedVideosList.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              <hr className="my-8"/>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mb-4">All Videos</h2>
          {paginatedVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">No videos found.</p>
          )}
        </>
      )}
    </div>
  );
}

