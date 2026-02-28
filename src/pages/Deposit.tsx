import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, ChevronRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const cryptoOptions = [
    { name: "Bitcoin", symbol: "BTC", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", icon: "https://assets.coincap.io/assets/icons/btc@2x.png" },
    { name: "Ethereum", symbol: "ETH", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", icon: "https://assets.coincap.io/assets/icons/eth@2x.png" },
    { name: "USDT (ERC20)", symbol: "USDT", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", icon: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    { name: "USDT (TRC20)", symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", icon: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    { name: "USDC (Ethereum)", symbol: "USDC", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", icon: "https://assets.coincap.io/assets/icons/usdc@2x.png" },
    { name: "Solana", symbol: "SOL", address: "vines1vzrYbzRbs2CRoM4ceBAzhdBTO780vfs777777", icon: "https://assets.coincap.io/assets/icons/sol@2x.png" },
];

const Deposit = () => {
    const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoOptions[0] | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Address copied to clipboard!");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-widest">Global Deposit</h2>
                    <p className="text-muted-foreground text-sm font-medium">Transfer assets to your merovianscapital account via direct blockchain transfer.</p>
                </div>

                {!selectedCrypto ? (
                    <Card className="bg-card border-border/50 shadow-xl overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Select Entry Currency</CardTitle>
                            <CardDescription className="text-xs">Choose your preferred cryptocurrency for the deposit session.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {cryptoOptions.map((crypto) => (
                                    <button
                                        key={crypto.name}
                                        className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-all text-left group"
                                        onClick={() => setSelectedCrypto(crypto)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center p-2 transition-colors border border-border/50 overflow-hidden">
                                                <img
                                                    src={crypto.icon}
                                                    alt={crypto.symbol}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement!.innerText = crypto.symbol;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{crypto.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-70">Mainnet | {crypto.symbol}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Button variant="ghost" onClick={() => setSelectedCrypto(null)} className="h-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-2 gap-2">
                            ← Return to Selection
                        </Button>

                        <Card className="bg-card border-border shadow-2xl overflow-hidden">
                            <CardHeader className="text-center bg-muted/30 border-b border-border/50 py-8">
                                <CardTitle className="text-2xl font-black">{selectedCrypto.name} Portal</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Network: {selectedCrypto.symbol} Native / EVM</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10 flex flex-col items-center">
                                {/* Fixed QR Code Implementation */}
                                <div className="p-6 bg-white rounded-[2rem] shadow-2xl shadow-primary/10 border-4 border-primary/5 dark:border-white/5 relative group">
                                    <QRCodeSVG
                                        value={selectedCrypto.address}
                                        size={220}
                                        level="H"
                                        includeMargin={true}
                                    />
                                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                <div className="w-full space-y-3">
                                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Destination Address</Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-muted/50 p-4 rounded-xl border border-border/50 break-all text-[11px] font-mono font-bold leading-relaxed text-foreground select-all">
                                            {selectedCrypto.address}
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-auto w-14 shrink-0 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                                            onClick={() => copyToClipboard(selectedCrypto.address)}
                                        >
                                            <Copy size={20} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full bg-yellow-500/5 border border-yellow-500/10 p-5 rounded-2xl flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                                        <Activity size={18} className="text-yellow-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black uppercase text-yellow-500">Security Requirement</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed font-bold">
                                            Only send <span className="text-foreground">{selectedCrypto.symbol}</span> on its native network. Transmitting any other asset will result in permanent capital loss. Minimum 3 network confirmations required.
                                        </p>
                                    </div>
                                </div>
                                <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={() => toast.success("Awaiting network confirmation...")}>
                                    Verify Transaction on Ledger
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Deposit;
const Activity = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
