import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = ["Home", "About Us", "Market", "Testimonials", "Learn More"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold tracking-wide text-foreground uppercase">BRAYO SITE</span>
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
          <Button variant="ghost" className="text-foreground hover:text-primary transition-colors" onClick={() => navigate("/auth")}>
            Login
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
              Login
            </Button>
            <Button className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
