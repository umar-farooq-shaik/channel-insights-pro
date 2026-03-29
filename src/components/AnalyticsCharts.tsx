import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { VideoItem } from "./TopPerformingVideos";

type TimeFilter = "24h" | "7d" | "14d" | "30d";

interface AnalyticsChartsProps {
  videos: VideoItem[];
  channelFollowers: number;
}

const filters: { label: string; value: TimeFilter }[] = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "14d", value: "14d" },
  { label: "30d", value: "30d" },
];

function generateTrendData(videos: VideoItem[], days: number) {
  const now = new Date();
  const data: { date: string; views: number; subscribers: number; engagement: number }[] = [];

  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const totalComments = videos.reduce((s, v) => s + v.comments, 0);
  const avgDailyViews = Math.round(totalViews / Math.max(days, 1));
  const avgEngagement = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const jitter = 0.7 + Math.random() * 0.6;
    const subJitter = 0.95 + Math.random() * 0.1;
    const engJitter = 0.8 + Math.random() * 0.4;

    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.round(avgDailyViews * jitter),
      subscribers: Math.round(1000 * subJitter * (1 + (days - i) * 0.002)),
      engagement: Math.round(avgEngagement * engJitter * 100) / 100,
    });
  }

  return data;
}

const filterToDays: Record<TimeFilter, number> = {
  "24h": 1,
  "7d": 7,
  "14d": 14,
  "30d": 30,
};

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

const chartConfigs = [
  {
    key: "views" as const,
    title: "Views Trend",
    color: "hsl(252, 55%, 58%)",
    gradientId: "viewsGrad",
  },
  {
    key: "subscribers" as const,
    title: "Subscriber Growth",
    color: "hsl(340, 82%, 65%)",
    gradientId: "subsGrad",
  },
  {
    key: "engagement" as const,
    title: "Engagement Trend",
    color: "hsl(174, 62%, 56%)",
    gradientId: "engGrad",
  },
];

const AnalyticsCharts = ({ videos, channelFollowers }: AnalyticsChartsProps) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("30d");

  const data = useMemo(
    () => generateTrendData(videos, filterToDays[activeFilter]),
    [videos, activeFilter]
  );

  return (
    <section className="max-w-[1100px] mx-auto px-6 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-[28px] md:text-[36px] font-black text-foreground">
            Analytics
          </h2>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeFilter === f.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {chartConfigs.map((cfg) => (
            <div
              key={cfg.key}
              className="border border-border rounded-2xl bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                {cfg.title}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={cfg.color} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatCompact}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(228, 25%, 12%)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [
                      cfg.key === "engagement" ? `${value}%` : formatCompact(value),
                      cfg.title,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={cfg.key}
                    stroke={cfg.color}
                    strokeWidth={2}
                    fill={`url(#${cfg.gradientId})`}
                    dot={false}
                    activeDot={{ r: 4, fill: cfg.color }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AnalyticsCharts;
