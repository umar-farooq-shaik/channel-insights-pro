import { supabase } from "@/integrations/supabase/client";

export interface YouTubeChannelResponse {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
}

export interface YouTubeVideoResponse {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  url: string;
}

export interface YouTubeAnalyticsResult {
  success: boolean;
  error?: string;
  channel?: YouTubeChannelResponse;
  videos?: YouTubeVideoResponse[];
}

export async function fetchYouTubeAnalytics(channelUrl: string): Promise<YouTubeAnalyticsResult> {
  const { data, error } = await supabase.functions.invoke("youtube-analytics", {
    body: { channelUrl },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as YouTubeAnalyticsResult;
}
