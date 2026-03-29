import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChannelOverview from "@/components/ChannelOverview";
import TopPerformingVideos from "@/components/TopPerformingVideos";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import ExportData from "@/components/ExportData";
import DailyMetrics from "@/components/DailyMetrics";
import Footer from "@/components/Footer";
import { dummyChannel, dummyVideos } from "@/lib/dummyData";
import { fetchYouTubeAnalytics } from "@/lib/youtubeApi";
import type { ChannelData } from "@/components/ChannelOverview";
import type { VideoItem } from "@/components/TopPerformingVideos";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState<ChannelData>(dummyChannel);
  const [videos, setVideos] = useState<VideoItem[]>(dummyVideos);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  const handleAnalyze = async (url: string) => {
    if (!url.trim()) return;
    setIsLoading(true);

    try {
      const result = await fetchYouTubeAnalytics(url);

      if (result.success && result.channel && result.videos) {
        setChannel({
          name: result.channel.name,
          avatar: result.channel.avatar,
          followers: result.channel.followers,
          engagementRate: result.channel.engagementRate,
          averageLikes: result.channel.averageLikes,
          averageComments: result.channel.averageComments,
        });

        setVideos(
          result.videos.map((v) => ({
            id: v.id,
            title: v.title,
            thumbnail: v.thumbnail,
            channelName: result.channel!.name,
            channelAvatar: result.channel!.avatar,
            views: v.views,
            likes: v.likes,
            comments: v.comments,
            publishedAt: v.publishedAt,
            url: v.url,
          }))
        );

        setHasAnalyzed(true);
        toast({ title: "Analysis complete", description: `Loaded data for ${result.channel.name}` });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to analyze channel. Showing demo data.",
          variant: "destructive",
        });
        // Fallback to dummy data
        setChannel(dummyChannel);
        setVideos(dummyVideos);
        setHasAnalyzed(true);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect. Showing demo data.",
        variant: "destructive",
      });
      setChannel(dummyChannel);
      setVideos(dummyVideos);
      setHasAnalyzed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {hasAnalyzed && (
          <>
            <ChannelOverview channel={channel} />
            <TopPerformingVideos
              videos={videos}
              channelName={channel.name}
              channelAvatar={channel.avatar}
            />
            <AnalyticsCharts
              videos={videos}
              channelFollowers={channel.followers}
            />
            <DailyMetrics channel={channel} videos={videos} />
            <ExportData channel={channel} videos={videos} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
