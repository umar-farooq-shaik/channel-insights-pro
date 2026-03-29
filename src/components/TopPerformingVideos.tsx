import { motion } from "framer-motion";
import { ExternalLink, Video } from "lucide-react";

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

const TopPerformingVideos = ({ videos, channelName, channelAvatar }: TopPerformingVideosProps) => {
  const top3 = videos.slice(0, 3);

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
        {top3.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group"
          >
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
                {/* Video icon overlay */}
                <div className="absolute bottom-2 left-2 bg-foreground/80 rounded p-1">
                  <Video size={14} className="text-primary-foreground" />
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
