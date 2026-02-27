const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "$65,586.51", change: "-1.50%", negative: true },
  { symbol: "ETH", name: "Ethereum", price: "$1,870.18", change: "+2.34%", negative: false },
  { symbol: "SOL", name: "Solana", price: "$124.41", change: "+4.87%", negative: false },
  { symbol: "DOGE", name: "Dogecoin", price: "$0.7705", change: "-0.42%", negative: true },
  { symbol: "XRP", name: "Ripple", price: "$2.09", change: "+1.15%", negative: false },
];

const MarketSection = () => {
  return (
    <section id="market" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gradient-blue">
          Market Pulse & Movement
        </h2>
        <div className="section-divider mb-12" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Chart placeholder */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-foreground font-semibold">Bitcoin (BTC):</span>
              <span className="text-green">$65,586.51</span>
              <span className="text-red text-sm">-1.50%</span>
            </div>
            <div className="space-y-2">
              {cryptoData.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      {coin.symbol}
                    </span>
                    <div>
                      <p className="text-foreground font-medium text-sm">{coin.name}</p>
                      <p className="text-muted-foreground text-xs">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-sm font-medium">{coin.price}</p>
                    <p className={`text-xs ${coin.negative ? "text-red" : "text-green"}`}>{coin.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empower text */}
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-bold text-foreground">How Brayo Site Empowers You</h3>
            <p className="text-muted-foreground leading-relaxed">
              Digital assets move 24/7 across global exchanges, driven by institutional flows, retail sentiment, and macroeconomic forces. Understanding these patterns is the key to profitable trading.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Brayo Site enables you to buy and sell crypto profitably with precision timing tools and market insights. Buy and Sell with our secure, fast platform designed for profitable outcomes.
            </p>
            <button className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Trade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
