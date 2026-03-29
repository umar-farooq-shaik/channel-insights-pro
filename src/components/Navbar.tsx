import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0 shrink-0">
          <span className="text-[22px] font-extrabold tracking-tight text-foreground leading-none">
            social
          </span>
          <span className="relative text-[22px] font-extrabold tracking-tight text-foreground leading-none">
            <span className="absolute -top-[6px] -right-[2px] w-[8px] h-[8px] rounded-full bg-accent" />
            i
          </span>
          <span className="text-[22px] font-extrabold tracking-tight text-foreground leading-none">
            nsider
          </span>
        </a>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg bg-cta-btn text-cta-btn-foreground text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Start 14-day free trial
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg border border-border text-foreground text-sm font-semibold transition-colors hover:bg-muted"
          >
            Login
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-3 bg-background">
          <a
            href="#"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg bg-cta-btn text-cta-btn-foreground text-sm font-semibold"
          >
            Start 14-day free trial
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg border border-border text-foreground text-sm font-semibold"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
