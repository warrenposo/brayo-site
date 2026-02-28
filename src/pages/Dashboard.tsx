import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, Activity, Wallet, BarChart3, PieChart, Timer } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

const cryptoData = [
    { name: "Bitcoin", symbol: "BTC", price: "$65,745.49", change: "+0.10%", positive: true, tradingViewSymbol: "BINANCE:BTCUSDT", icon: "https://assets.coincap.io/assets/icons/btc@2x.png" },
    { name: "Ethereum", symbol: "ETH", price: "$1,925.93", change: "+0.44%", positive: true, tradingViewSymbol: "BINANCE:ETHUSDT", icon: "https://assets.coincap.io/assets/icons/eth@2x.png" },
    { name: "Cardano", symbol: "ADA", price: "$0.272", change: "-1.31%", positive: false, tradingViewSymbol: "BINANCE:ADAUSDT", icon: "https://assets.coincap.io/assets/icons/ada@2x.png" },
    { name: "BNB", symbol: "BNB", price: "$610.04", change: "+0.23%", positive: true, tradingViewSymbol: "BINANCE:BNBUSDT", icon: "https://assets.coincap.io/assets/icons/bnb@2x.png" },
    { name: "Solana", symbol: "SOL", price: "$81.96", change: "+0.76%", positive: true, tradingViewSymbol: "BINANCE:SOLUSDT", icon: "https://assets.coincap.io/assets/icons/sol@2x.png" },
];

const Dashboard = () => {
    const { profile, loading } = useProfile();
    const [selectedAsset, setSelectedAsset] = useState(cryptoData[0]);

    if (loading) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Portfolio...</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Activity size={16} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Market Active</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase tracking-widest">
                            Welcome, <span className="text-primary">{profile?.email.split('@')[0]}</span>
                        </h2>
                        <p className="text-muted-foreground text-sm font-medium mt-1">Real-time Trading & Portfolio Analytics</p>
                    </div>
                    <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                        <div className="px-4 py-2 bg-background rounded-xl border border-border/50 shadow-sm">
                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Status</p>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", profile?.kyc_status === 'verified' ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-yellow-500 shadow-[0_0_8px_#eab308]")} />
                                <p className="text-[10px] font-bold uppercase">{profile?.kyc_status || 'Unverified'}</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                            <p className="text-[9px] font-black uppercase text-primary tracking-tighter">Account</p>
                            <p className="text-[10px] font-black uppercase text-primary">{profile?.user_type === 'admin' ? 'Master' : 'Trading'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-[#0F172A] border-white/5 shadow-xl overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-yellow-500 transition-colors">Total Balance (USD)</CardTitle>
                            <Wallet className="h-4 w-4 text-white/40 group-hover:text-yellow-500 transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums text-white">${profile?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <p className="text-[10px] text-green-500 mt-2 flex items-center font-bold tracking-widest">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +0.00%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0F172A] border-white/5 shadow-xl overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-yellow-500 transition-colors">Performance</CardTitle>
                            <BarChart3 className="h-4 w-4 text-white/40 group-hover:text-yellow-500 transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums text-white">{profile?.performance}%</div>
                            <p className="text-[10px] text-yellow-500 mt-2 font-bold uppercase tracking-widest">+0% Gain</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0F172A] border-white/5 shadow-xl overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-yellow-500 transition-colors">Total Profits</CardTitle>
                            <PieChart className="h-4 w-4 text-white/40 group-hover:text-yellow-500 transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums text-white">${profile?.total_profits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <p className="text-[10px] text-yellow-500 mt-2 font-bold uppercase tracking-widest">+0% Gain</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0F172A] border-white/5 shadow-xl overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-yellow-500 transition-colors">Active Trades</CardTitle>
                            <Timer className="h-4 w-4 text-white/40 group-hover:text-yellow-500 transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums text-white">{profile?.active_trades}</div>
                            <p className="text-[10px] text-yellow-500 mt-2 font-bold uppercase tracking-widest">+0 Open Positions</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <Card className="lg:col-span-8 bg-[#0F172A] border-white/5 shadow-2xl overflow-hidden">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6 px-8 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-white">{selectedAsset.name} ({selectedAsset.symbol}): <span className="text-[#FACC15]">${selectedAsset.price.replace('$', '')}</span> <span className={cn("ml-2", selectedAsset.positive ? "text-green-500" : "text-red-500")}>{selectedAsset.change}</span></CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex h-[450px]">
                            {/* Asset Selection Sidebar */}
                            <div className="w-20 border-r border-white/5 flex flex-col p-2 gap-2 bg-black/20">
                                {cryptoData.map((asset) => (
                                    <button
                                        key={asset.symbol}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={cn(
                                            "h-12 flex items-center justify-center rounded-lg text-xs font-black transition-all border",
                                            selectedAsset.symbol === asset.symbol
                                                ? "bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-yellow-500/10"
                                                : "text-white/20 border-white/5 hover:text-white/60 hover:bg-white/5"
                                        )}
                                    >
                                        {asset.symbol}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1">
                                <TradingViewWidget symbol={selectedAsset.tradingViewSymbol} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-4 bg-[#0F172A] border-white/5 shadow-2xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6 px-8">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                                <TrendingUp size={16} className="text-[#FACC15]" /> Top Movers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                            <div className="divide-y divide-white/5">
                                {cryptoData.map((coin) => (
                                    <div key={coin.symbol} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2 border border-white/5 overflow-hidden">
                                                <img
                                                    src={coin.icon}
                                                    alt={coin.symbol}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement!.innerText = coin.symbol.slice(0, 2);
                                                        target.parentElement!.classList.add('text-[10px]', 'font-black', 'text-white/40');
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{coin.name}</p>
                                                <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">{coin.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black tabular-nums text-white">{coin.price}</p>
                                            <p className={cn("text-[11px] font-bold tabular-nums", coin.positive ? "text-green-500" : "text-red-500")}>{coin.change}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-[#0F172A] border-white/5 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6 px-8">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                            <Timer size={16} className="text-white/40" /> Ledger Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-center py-20">
                            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4 border border-white/5">
                                <Activity size={20} className="text-white/20" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Transmissions Empty</h4>
                            <p className="text-[9px] font-bold text-white/20 mt-1 uppercase tracking-tighter">Initialize a trade to populate the ledger</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
