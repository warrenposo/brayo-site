import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["Home", "About Us", "Market", "Testimonials", "Learn More"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <span className="font-heading text-lg font-bold tracking-wide text-foreground">MEROVIAN</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Dashboard
          </button>
          <button className="px-5 py-2 rounded-md border border-foreground text-foreground text-sm font-medium hover:bg-muted transition-colors">
            Logout
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm">Dashboard</button>
            <button className="px-5 py-2 rounded-md border border-foreground text-foreground text-sm">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
