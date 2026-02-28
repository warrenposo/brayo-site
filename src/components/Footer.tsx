const platformLinks = ["About Us", "Market", "Testimonials", "Learn More"];
const tradeLinks = [
  "Bitcoin (BTC)", "Ethereum (ETH)", "Tether USDT (TRC20)", "Tether USDT (ERC20)",
  "Litecoin (LTC)", "Binance Coin (BNB)", "Ripple (XRP)", "Dogecoin (DOGE)",
];

import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#FACC15]" size={32} />
              <span className="text-2xl font-black text-white tracking-widest uppercase">Merovian</span>
            </div>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              Trade major crypto assets with confidence and clarity. Professional trading experience with security-first systems.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">About Us</a></li>
              <li><a href="#market" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Market</a></li>
              <li><a href="#testimonials" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Testimonials</a></li>
              <li><a href="#learn-more" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Learn More</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">Trade</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Bitcoin (BTC)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Ethereum (ETH)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Tether USDT (TRC20)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Tether USDT (ERC20)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Litecoin (LTC)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Binance Coin (BNB)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Ripple (XRP)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Dogecoin (DOGE)</a>
              <a href="#" className="text-white/40 hover:text-[#FACC15] transition-colors font-medium">Tron (TRX)</a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            &copy; {new Date().getFullYear()} Merovian. All rights reserved.
          </p>
          <p className="text-white/40 text-sm font-medium">
            Cryptocurrency trading involves risk. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
