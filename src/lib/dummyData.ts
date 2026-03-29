import type { ChannelData } from "@/components/ChannelOverview";
import type { VideoItem } from "@/components/TopPerformingVideos";
import hboAvatar from "@/assets/hbo-avatar.png";

export const dummyChannel: ChannelData = {
  name: "HBO",
  avatar: hboAvatar,
  followers: 0,
  engagementRate: 0,
  averageLikes: 601.31,
  averageComments: 26.34,
};

export const dummyVideos: VideoItem[] = [
  {
    id: "1",
    title: "HBO Original Series Trailer",
    thumbnail: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&h=340&fit=crop",
    channelName: "HBO",
    channelAvatar: dummyChannel.avatar,
    views: 1_250_000,
    likes: 45_000,
    comments: 3_200,
    publishedAt: "2026-03-15",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Behind the Scenes - New Season",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=340&fit=crop",
    channelName: "HBO",
    channelAvatar: dummyChannel.avatar,
    views: 890_000,
    likes: 32_000,
    comments: 2_100,
    publishedAt: "2026-03-10",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "Season Finale Recap",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=340&fit=crop",
    channelName: "HBO",
    channelAvatar: dummyChannel.avatar,
    views: 670_000,
    likes: 28_000,
    comments: 1_800,
    publishedAt: "2026-03-05",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];
