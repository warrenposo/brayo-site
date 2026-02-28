import { useState } from "react";
import TradingViewWidget from "./TradingViewWidget";

const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "$65,879.83", change: "+0.05%", negative: false, tradingViewSymbol: "BINANCE:BTCUSDT" },
  { symbol: "ETH", name: "Ethereum", price: "$3,452.12", change: "+1.24%", negative: false, tradingViewSymbol: "BINANCE:ETHUSDT" },
  { symbol: "ADA", name: "Cardano", price: "$0.4521", change: "-0.87%", negative: true, tradingViewSymbol: "BINANCE:ADAUSDT" },
  { symbol: "BNB", name: "Binance Coin", price: "$582.34", change: "+0.15%", negative: false, tradingViewSymbol: "BINANCE:BNBUSDT" },
  { symbol: "SOL", name: "Solana", price: "$142.11", change: "+2.45%", negative: false, tradingViewSymbol: "BINANCE:SOLUSDT" },
];

const MarketSection = () => {
  const [selectedAsset, setSelectedAsset] = useState(cryptoData[0]);

  return (
    <section id="market" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center text-[#2563EB] mb-12">
          Market Pulse & Movement
          <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
        </h2>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-foreground font-black text-sm uppercase tracking-widest">{selectedAsset.name} ({selectedAsset.symbol}):</span>
              <span className="text-[#FACC15] font-black">{selectedAsset.price}</span>
              <span className={selectedAsset.negative ? "text-red-500" : "text-green-500"}>{selectedAsset.change}</span>
            </div>

            <div className="flex bg-[#0F172A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
              {/* Asset Selection Sidebar */}
              <div className="w-24 border-r border-white/5 flex flex-col p-2 gap-2 bg-[#020617]">
                {cryptoData.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`h-12 flex items-center justify-center rounded-lg text-xs font-black transition-all ${selectedAsset.symbol === asset.symbol
                      ? "bg-[#FACC15] text-black shadow-lg shadow-yellow-500/20"
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-white/10"
                      }`}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>

              {/* Chart Area */}
              <div className="flex-1 min-h-[450px]">
                <TradingViewWidget symbol={selectedAsset.tradingViewSymbol} height={450} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 pt-8">
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-white leading-tight">
                How Merovian <br /> Empowers You
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Digital assets move 24/7 across global exchanges, driven by institutional flows, retail sentiment, and macroeconomic forces. Understanding these patterns is the key to profitable trading.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                Merovian enables you to buy and sell crypto profitably with precision timing tools and market insights. Buy and Sell with our secure, fast platform designed for profitable outcomes.
              </p>
              <button className="w-full h-16 rounded-2xl bg-[#FACC15] text-black font-black text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-yellow-500/20">
                Trade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
