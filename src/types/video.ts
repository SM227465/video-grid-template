export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
}

export type VideoQuality = "480p" | "720p" | "1080p" | "4K";

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // Placeholder for actual video source
  previewVideoUrl?: string; // For hover preview
  duration: number; // in seconds
  tags: string[];
  quality: VideoQuality[];
  uploadDate: Date;
  uploader: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  views: number;
  likes: number;
  dislikes: number;
  comments: VideoComment[]; // Simplified for now, could be paginated
  // For paid content
  isPaid?: boolean; 
  price?: number; // Optional price if it's a paid video
}

// Example structure for API responses
export interface PaginatedVideosResponse {
  videos: Video[];
  currentPage: number;
  totalPages: number;
  totalVideos: number;
}

export interface PaginatedCommentsResponse {
  comments: VideoComment[];
  currentPage: number;
  totalPages: number;
  totalComments: number;
}
