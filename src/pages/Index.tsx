import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChannelOverview from "@/components/ChannelOverview";
import TopPerformingVideos from "@/components/TopPerformingVideos";
import Footer from "@/components/Footer";
import { dummyChannel, dummyVideos } from "@/lib/dummyData";
import type { ChannelData } from "@/components/ChannelOverview";
import type { VideoItem } from "@/components/TopPerformingVideos";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState<ChannelData>(dummyChannel);
  const [videos, setVideos] = useState<VideoItem[]>(dummyVideos);
  const [hasAnalyzed, setHasAnalyzed] = useState(true); // show dummy data by default

  const handleAnalyze = (url: string) => {
    if (!url.trim()) return;
    setIsLoading(true);

    // Simulate analysis with dummy data
    setTimeout(() => {
      setChannel(dummyChannel);
      setVideos(dummyVideos);
      setHasAnalyzed(true);
      setIsLoading(false);
    }, 1500);
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
