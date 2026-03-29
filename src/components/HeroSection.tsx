import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onAnalyze, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(url);
  };

  return (
    <section className="pt-16 pb-12 px-6" style={{ backgroundColor: "hsl(var(--hero-bg))" }}>
      <div className="max-w-[720px] mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[40px] md:text-[56px] font-black leading-[1.1] tracking-tight text-foreground mb-4"
        >
          FREE YouTube Analytics
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-[600px] mx-auto"
        >
          Understand your target audience to better resonate with the people most likely to engage with your brand
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative flex items-center max-w-[600px] mx-auto bg-background rounded-full border border-border shadow-sm overflow-hidden"
        >
          <div className="pl-5 text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube channel like this: https://www.youtube.com/@hbo"
            className="flex-1 h-[56px] px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-[44px] px-7 mr-[6px] rounded-full bg-check-btn text-primary-foreground text-sm font-semibold transition-colors hover:bg-check-btn-hover disabled:opacity-60 shrink-0"
          >
            {isLoading ? "Checking..." : "Check"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default HeroSection;
