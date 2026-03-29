import { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Upload } from "lucide-react";
import type { ChannelData } from "./ChannelOverview";
import type { VideoItem } from "./TopPerformingVideos";

interface DailyMetricsProps {
  channel: ChannelData;
  videos: VideoItem[];
}

const DailyMetrics = ({ channel, videos }: DailyMetricsProps) => {
  const metrics = useMemo(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const recentVideos = videos.filter(
      (v) => new Date(v.publishedAt).getTime() >= thirtyDaysAgo
    );
    const count = recentVideos.length || 1;
    const totalViews = recentVideos.reduce((s, v) => s + v.views, 0);
    const totalLikes = recentVideos.reduce((s, v) => s + v.likes, 0);
    const totalComments = recentVideos.reduce((s, v) => s + v.comments, 0);

    const dailyViews = Math.round(totalViews / 30);
    const subscriberDelta = Math.round(channel.followers * 0.003); // simulated
    const engagementPerDay =
      totalViews > 0
        ? Math.round(((totalLikes + totalComments) / totalViews) * 10000) / 100
        : 0;
    const uploadFrequency = Math.round((count / 30) * 100) / 100;

    return [
      { label: "Daily Views", value: dailyViews, formatted: formatCompact(dailyViews), icon: Eye, color: "text-engagement-icon" },
      { label: "Subscriber Delta", value: subscriberDelta, formatted: `+${formatCompact(subscriberDelta)}`, icon: Users, color: "text-likes-icon" },
      { label: "Engagement / Day", value: engagementPerDay, formatted: `${engagementPerDay}%`, icon: TrendingUp, color: "text-comments-icon" },
      { label: "Upload Frequency", value: uploadFrequency, formatted: `${uploadFrequency}/day`, icon: Upload, color: "text-foreground" },
    ];
  }, [channel, videos]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="max-w-[1100px] mx-auto px-6 mb-16"
    >
      <h2 className="text-[28px] md:text-[36px] font-black text-foreground mb-8">
        Daily Metrics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="border border-border rounded-2xl bg-card p-5 flex flex-col gap-3"
          >
            <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${m.color}`}>
              <m.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{m.formatted}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default DailyMetrics;
