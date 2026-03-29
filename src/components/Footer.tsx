const footerSections = [
  {
    title: "Product",
    links: ["Social Media Analytics", "Social Media Reporting", "Social Media Benchmarking", "Social Listening", "Campaign Reporting"],
  },
  {
    title: "Resources",
    links: ["Blog", "Studies", "Podcast", "Instagram Benchmarks", "Facebook Benchmarks", "TikTok Benchmarks"],
  },
  {
    title: "Company",
    links: ["Contact", "Meet the Team", "Reviews"],
  },
];

const socialIcons = [
  { name: "TikTok", svg: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" },
  { name: "Facebook", svg: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { name: "Instagram", svg: "" },
  { name: "X", svg: "" },
  { name: "LinkedIn", svg: "" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo column */}
          <div>
            <a href="/" className="flex items-center gap-0 mb-4">
              <span className="text-[18px] font-extrabold tracking-tight text-foreground">
                social
              </span>
              <span className="relative text-[18px] font-extrabold tracking-tight text-foreground">
                <span className="absolute -top-[5px] -right-[2px] w-[6px] h-[6px] rounded-full bg-accent" />
                i
              </span>
              <span className="text-[18px] font-extrabold tracking-tight text-foreground">
                nsider
              </span>
            </a>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-footer-heading mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-footer-link hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-8">
          {["tiktok", "facebook", "instagram", "x", "linkedin"].map((name) => (
            <a
              key={name}
              href="#"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label={name}
            >
              <span className="text-xs font-bold uppercase">{name[0]}</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Legal */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Data Processing Agreement</a>
          <span>|</span>
          <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
