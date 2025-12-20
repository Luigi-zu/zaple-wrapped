
export interface Comment {
  id: string;
  username: string;
  text: string;
  profilePic: string;
}

export interface VideoData {
  id: string;
  title: string;
  videoUrl: string;
  views: number;
  likes: number;
  comments: number;
}

export interface WrappedData {
  influencerName: string;
  influencerPhoto: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalMinutes: number;
  totalVideos: number;
  supportiveComments: Comment[];
  weirdComments: Comment[];
  topVideos: VideoData[];
}
