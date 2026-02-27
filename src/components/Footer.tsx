const platformLinks = ["About Us", "Market", "Testimonials", "Learn More"];
const tradeLinks = [
  "Bitcoin (BTC)", "Ethereum (ETH)", "Tether USDT (TRC20)", "Tether USDT (ERC20)",
  "Litecoin (LTC)", "Binance Coin (BNB)", "Ripple (XRP)", "Dogecoin (DOGE)",
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-heading text-lg font-bold text-foreground">MEROVIAN</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Trade major crypto assets with confidence and clarity. Professional trading experience with security-first systems.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-bold text-foreground mb-4">Platform</h4>
          <ul className="space-y-2">
            {platformLinks.map((link) => (
              <li key={link}>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-foreground mb-4">Trade</h4>
          <ul className="space-y-2">
            {tradeLinks.map((link) => (
              <li key={link}>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-border">
        <p className="text-muted-foreground text-sm text-center">
          © 2024 Merovian. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
