import DashboardLayout from "@/components/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Wallet, BarChart3, PieChart, Timer } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const chartData = [
    { time: "00:00", price: 62000 },
    { time: "03:00", price: 63500 },
    { time: "06:00", price: 63000 },
    { time: "09:00", price: 65000 },
    { time: "12:00", price: 67000 },
    { time: "15:00", price: 66000 },
    { time: "18:00", price: 68000 },
    { time: "21:00", price: 65438 },
];

const topMovers = [
    { name: "Bitcoin", symbol: "BTC", price: "$65,438.96", change: "+0.37%", positive: true },
    { name: "Ethereum", symbol: "ETH", price: "$2,680.50", change: "-1.42%", positive: false },
    { name: "Cardano", symbol: "ADA", price: "$0.520", change: "+0.85%", positive: true },
    { name: "BNB", symbol: "BNB", price: "$615.00", change: "+1.23%", positive: true },
    { name: "Solana", symbol: "SOL", price: "$98.75", change: "+5.67%", positive: true },
];

const Dashboard = () => {
    const { profile, loading } = useProfile();

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
                    <Card className="bg-card border-border/50 shadow-xl overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Available Liquidity</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums">{profile?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-muted-foreground opacity-50 ml-1">USDT</span></div>
                            <p className="text-[10px] text-green-500 mt-2 flex items-center font-bold font-mono">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{profile?.performance.toFixed(2)}% Performance
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-xl overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Yield Optimization</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums">{profile?.performance}%</div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest opacity-60">Total Profitability</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-xl overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Cumulative Returns</CardTitle>
                            <PieChart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums">${profile?.total_profits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest opacity-60">Net Realized Gain</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-xl overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Trading Velocity</CardTitle>
                            <Timer className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tabular-nums">{profile?.active_trades}</div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest opacity-60">Open Transmissions</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <Card className="lg:col-span-8 bg-card border-border/50 shadow-2xl overflow-hidden">
                        <CardHeader className="bg-muted/20 border-b border-border/50 py-6 px-8 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Market Analysis: BTC/USDT</CardTitle>
                                <CardDescription className="text-[10px] font-bold">Live Data Transmission | 24h Aggregated Feed</CardDescription>
                            </div>
                            <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-xl border border-border/50">
                                <span className="text-lg font-black tabular-nums text-yellow-500">$65,438.96</span>
                                <span className="text-[10px] font-bold text-green-500">+0.37%</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 'bold' }} />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', fontSize: '10px', padding: '12px' }}
                                        labelStyle={{ fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase' }}
                                        itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-4 bg-card border-border/50 shadow-2xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-muted/20 border-b border-border/50 py-6 px-8">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" /> Global Movers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                            <div className="divide-y divide-border/50">
                                {topMovers.map((coin) => (
                                    <div key={coin.symbol} className="flex items-center justify-between p-5 hover:bg-primary/5 transition-all group cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center font-black text-[11px] transition-colors border border-border/50">
                                                {coin.symbol}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-foreground">{coin.name}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter opacity-70">{coin.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black tabular-nums">{coin.price}</p>
                                            <p className={cn("text-[10px] font-bold tabular-nums", coin.positive ? "text-green-500" : "text-red-500")}>{coin.change}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border/50 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b border-border/50 py-6 px-8">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Timer size={16} className="text-muted-foreground" /> Ledger Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-center py-20 bg-card/50">
                            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                                <Activity size={20} className="text-muted-foreground opacity-30" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Transmissions Empty</h4>
                            <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter opacity-40">Initialize a trade to populate the ledger</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
