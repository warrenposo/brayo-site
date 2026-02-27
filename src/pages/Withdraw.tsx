import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Withdraw = () => {
    const { profile, refreshProfile } = useProfile();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        wallet_type: "",
        address: "",
        amount: "",
    });

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);

        if (amount > (profile?.balance || 0)) {
            toast.error("Insufficient balance");
            return;
        }

        if (amount < 10) {
            toast.error("Minimum withdrawal amount is $10.00");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from("transactions")
                .insert({
                    user_id: profile?.id,
                    type: "withdrawal",
                    coin: formData.wallet_type,
                    amount: amount,
                    status: "pending",
                });

            if (error) throw error;

            // Deduct balance (In a real app, this should be a transaction on the backend)
            const { error: balanceError } = await supabase
                .from("profiles")
                .update({ balance: (profile?.balance || 0) - amount })
                .eq("id", profile?.id);

            if (balanceError) throw balanceError;

            toast.success("Withdrawal request submitted! It will be processed shortly.");
            setFormData({ wallet_type: "", address: "", amount: "" });
            refreshProfile();
        } catch (error: any) {
            toast.error("Withdrawal failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-xl mx-auto animate-in fade-in duration-500">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Withdraw Crypto</h2>
                    <p className="text-muted-foreground text-sm">Securely withdraw your assets to your personal wallet.</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Request Withdrawal</CardTitle>
                        <CardDescription>Available Balance: {profile?.balance.toFixed(2)} USDT</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleWithdraw} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Select Wallet Type</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, wallet_type: val })} required>
                                    <SelectTrigger className="bg-background border-border text-xs">
                                        <SelectValue placeholder="Choose a wallet..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                                        <SelectItem value="usdt_erc20">USDT (ERC20)</SelectItem>
                                        <SelectItem value="usdt_trc20">USDT (TRC20)</SelectItem>
                                        <SelectItem value="usdc">USDC (Ethereum)</SelectItem>
                                        <SelectItem value="sol">Solana (SOL)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Destination Wallet Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter the wallet address to receive funds"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="bg-background border-border text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (USD)</Label>
                                <div className="relative">
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter amount to withdraw"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="bg-background border-border text-xs pr-16"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary"
                                        onClick={() => setFormData({ ...formData, amount: (profile?.balance || 0).toString() })}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="bg-muted p-4 rounded-lg space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Important Notice</p>
                                <ul className="text-[10px] text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Withdrawals are processed within 10 minutes</li>
                                    <li>Double-check the wallet address - transactions cannot be reversed</li>
                                    <li>Minimum withdrawal amount is $10.00</li>
                                    <li>Network fees may apply depending on the blockchain</li>
                                </ul>
                            </div>

                            <Button type="submit" className="w-full bg-primary hover:opacity-90" disabled={loading}>
                                {loading ? "Processing..." : "Withdraw"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Withdraw;
