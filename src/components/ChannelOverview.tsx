import { motion } from "framer-motion";
import { Zap, Heart, MessageCircle, Info } from "lucide-react";

export interface ChannelData {
  name: string;
  avatar: string;
  followers: number;
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
}

interface ChannelOverviewProps {
  channel: ChannelData;
}

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
};

const ChannelOverview = ({ channel }: ChannelOverviewProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto px-6 -mt-2 mb-12"
    >
      <div className="border border-border rounded-2xl bg-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-0">
        {/* Channel info */}
        <div className="flex items-center gap-4 md:w-[260px] shrink-0">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-[56px] h-[56px] rounded-full object-cover bg-muted"
          />
          <div>
            <h3 className="text-lg font-bold text-foreground">{channel.name}</h3>
            <p className="text-sm text-muted-foreground">{formatNumber(channel.followers)} Followers</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-1 items-center justify-around w-full md:w-auto gap-4 md:gap-0">
          {/* Engagement Rate */}
          <div className="flex flex-col items-center text-center md:border-l border-border md:px-8">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-2xl font-bold text-metric-value">{channel.engagementRate}%</span>
              <Zap size={18} className="text-engagement-icon" />
            </div>
            <span className="text-xs text-metric-label">Engagement Rate</span>
          </div>

          {/* Average Likes */}
          <div className="flex flex-col items-center text-center md:border-l border-border md:px-8">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-2xl font-bold text-metric-value">{channel.averageLikes.toFixed(2)}</span>
              <Heart size={18} className="text-likes-icon" />
            </div>
            <span className="text-xs text-metric-label">Average Likes</span>
          </div>

          {/* Average Comments */}
          <div className="flex flex-col items-center text-center md:border-l border-border md:px-8">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-2xl font-bold text-metric-value">{channel.averageComments.toFixed(2)}</span>
              <MessageCircle size={18} className="text-comments-icon" />
            </div>
            <span className="text-xs text-metric-label">Average Comments</span>
          </div>
        </div>

        {/* Info icon */}
        <div className="hidden md:flex items-start ml-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="More info">
            <Info size={18} />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ChannelOverview;
