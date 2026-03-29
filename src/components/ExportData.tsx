import { Download } from "lucide-react";
import { motion } from "framer-motion";
import type { ChannelData } from "./ChannelOverview";
import type { VideoItem } from "./TopPerformingVideos";

interface ExportDataProps {
  channel: ChannelData;
  videos: VideoItem[];
}

function buildCsv(channel: ChannelData, videos: VideoItem[]): string {
  const lines: string[] = [];
  lines.push("Channel,Followers,Engagement Rate,Avg Likes,Avg Comments");
  lines.push(
    `"${channel.name}",${channel.followers},${channel.engagementRate}%,${channel.averageLikes},${channel.averageComments}`
  );
  lines.push("");
  lines.push("Video Title,Views,Likes,Comments,Published,URL");
  videos.forEach((v) => {
    lines.push(
      `"${v.title.replace(/"/g, '""')}",${v.views},${v.likes},${v.comments},${v.publishedAt},"${v.url}"`
    );
  });
  return lines.join("\n");
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const ExportData = ({ channel, videos }: ExportDataProps) => {
  const handleCsv = () => {
    downloadBlob(buildCsv(channel, videos), `${channel.name}-analytics.csv`, "text/csv");
  };

  const handleJson = () => {
    const payload = { channel, videos };
    downloadBlob(JSON.stringify(payload, null, 2), `${channel.name}-analytics.json`, "application/json");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="max-w-[1100px] mx-auto px-6 mb-16"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-border rounded-2xl bg-card p-5 gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Export Data</h3>
          <p className="text-sm text-muted-foreground">Download channel analytics and video metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCsv}
            className="inline-flex items-center gap-2 h-[40px] px-5 rounded-lg border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Download size={15} />
            CSV
          </button>
          <button
            onClick={handleJson}
            className="inline-flex items-center gap-2 h-[40px] px-5 rounded-lg bg-check-btn text-primary-foreground text-sm font-semibold transition-colors hover:bg-check-btn-hover"
          >
            <Download size={15} />
            JSON
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ExportData;
