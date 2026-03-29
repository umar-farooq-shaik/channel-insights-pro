import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Video, Trophy, Eye, Heart, MessageCircle } from "lucide-react";

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  url: string;
}

interface TopPerformingVideosProps {
  videos: VideoItem[];
  channelName: string;
  channelAvatar: string;
}

function computeScore(video: VideoItem): number {
  const now = Date.now();
  const published = new Date(video.publishedAt).getTime();
  const daysSincePublish = Math.max(1, (now - published) / (1000 * 60 * 60 * 24));
  const recencyBoost = Math.max(0, 1 - daysSincePublish / 30); // 1.0 if today, 0 if 30+ days

  return (
    video.views * 0.5 +
    video.likes * 0.2 +
    video.comments * 0.2 +
    recencyBoost * 10000 * 0.1
  );
}

const rankColors = [
  "from-amber-400 to-yellow-500",   // #1 gold
  "from-slate-300 to-slate-400",     // #2 silver
  "from-amber-600 to-amber-700",     // #3 bronze
];

const rankLabels = ["1st", "2nd", "3rd"];

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

const TopPerformingVideos = ({ videos, channelName, channelAvatar }: TopPerformingVideosProps) => {
  const ranked = useMemo(() => {
    return [...videos]
      .map((v) => ({ ...v, score: computeScore(v) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [videos]);

  return (
    <section className="max-w-[1100px] mx-auto px-6 mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-[28px] md:text-[36px] font-black text-center text-foreground mb-10"
      >
        Top Performing Posts
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ranked.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative"
          >
            {/* Ranking badge */}
            <div
              className={`absolute -top-3 -left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${rankColors[i]} shadow-md`}
            >
              <Trophy size={13} className="text-foreground" />
              <span className="text-xs font-bold text-foreground">{rankLabels[i]}</span>
            </div>

            {/* Phone mockup card */}
            <div className="bg-foreground rounded-[28px] p-3 pt-4 pb-6 shadow-lg">
              {/* Card header */}
              <div className="flex items-center justify-between px-3 mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={channelAvatar}
                    alt={channelName}
                    className="w-8 h-8 rounded-full object-cover bg-muted"
                  />
                  <span className="text-sm font-semibold text-primary-foreground">{channelName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary-foreground/70 bg-primary-foreground/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Video size={12} />
                    Video
                  </span>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    aria-label="Open video"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-foreground/80 rounded p-1">
                  <Video size={14} className="text-primary-foreground" />
                </div>
              </div>

              {/* Metrics bar */}
              <div className="flex items-center justify-around px-2 mt-3">
                <div className="flex items-center gap-1 text-primary-foreground/70">
                  <Eye size={13} />
                  <span className="text-[11px] font-medium">{formatCompact(video.views)}</span>
                </div>
                <div className="flex items-center gap-1 text-primary-foreground/70">
                  <Heart size={13} />
                  <span className="text-[11px] font-medium">{formatCompact(video.likes)}</span>
                </div>
                <div className="flex items-center gap-1 text-primary-foreground/70">
                  <MessageCircle size={13} />
                  <span className="text-[11px] font-medium">{formatCompact(video.comments)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopPerformingVideos;
