import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Eye, Heart, MessageCircle, Clock, ExternalLink } from "lucide-react";
import type { VideoItem } from "./TopPerformingVideos";

type SortKey = "views" | "engagement" | "recency";

interface VideoListProps {
  videos: VideoItem[];
}

const sortOptions: { label: string; value: SortKey; icon: typeof Eye }[] = [
  { label: "Views", value: "views", icon: Eye },
  { label: "Engagement", value: "engagement", icon: Heart },
  { label: "Recency", value: "recency", icon: Clock },
];

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

const VideoList = ({ videos }: VideoListProps) => {
  const [sortBy, setSortBy] = useState<SortKey>("views");

  const sorted = useMemo(() => {
    return [...videos].sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "engagement":
          return (b.likes + b.comments) - (a.likes + a.comments);
        case "recency":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
  }, [videos, sortBy]);

  if (!videos.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="max-w-[1100px] mx-auto px-6 mb-16"
    >
      {/* Header + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-[28px] md:text-[36px] font-black text-foreground">
          All Videos
        </h2>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <opt.icon size={14} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[1fr_100px_100px_100px_120px_40px] gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Video</span>
          <span className="text-right">Views</span>
          <span className="text-right">Likes</span>
          <span className="text-right">Comments</span>
          <span className="text-right">Published</span>
          <span />
        </div>

        {sorted.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px_120px_40px] gap-2 md:gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors items-center"
          >
            {/* Title + thumbnail */}
            <div className="flex items-center gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-10 rounded-md object-cover bg-muted shrink-0"
                loading="lazy"
              />
              <span className="text-sm font-medium text-foreground line-clamp-2">
                {video.title}
              </span>
            </div>

            {/* Metrics - mobile: inline row, desktop: separate cols */}
            <div className="flex md:justify-end items-center gap-1 text-sm text-muted-foreground md:text-foreground">
              <Eye size={13} className="md:hidden" />
              {formatCompact(video.views)}
            </div>
            <div className="flex md:justify-end items-center gap-1 text-sm text-muted-foreground md:text-foreground">
              <Heart size={13} className="md:hidden" />
              {formatCompact(video.likes)}
            </div>
            <div className="flex md:justify-end items-center gap-1 text-sm text-muted-foreground md:text-foreground">
              <MessageCircle size={13} className="md:hidden" />
              {formatCompact(video.comments)}
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex justify-end">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open video"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default VideoList;
