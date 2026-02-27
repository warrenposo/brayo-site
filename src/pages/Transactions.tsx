import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
    id: string;
    type: "deposit" | "withdrawal";
    coin: string;
    amount: number;
    status: "pending" | "completed" | "rejected";
    tx_hash: string | null;
    created_at: string;
}

const Transactions = () => {
    const { profile } = useProfile();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", profile?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error: any) {
            toast.error("Error fetching transactions: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile?.id) {
            fetchTransactions();
        }
    }, [profile]);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                        <p className="text-muted-foreground text-sm">View your transaction history and verify deposits</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-card border-border">
                        <CheckCircle2 size={16} className="mr-2 text-primary" /> Validate Transaction
                    </Button>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">Loading transactions...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                <p>No transactions yet. Make a deposit to see your transaction history here.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Coin</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>TX Hash</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-xs">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="capitalize text-xs font-medium">
                                                {tx.type}
                                            </TableCell>
                                            <TableCell className="uppercase text-xs">
                                                {tx.coin}
                                            </TableCell>
                                            <TableCell className="text-xs font-bold">
                                                {tx.amount.toFixed(2)} USDT
                                            </TableCell>
                                            <TableCell>
                                                <div className={cn(
                                                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase",
                                                    tx.status === 'completed' && "bg-green-500/10 text-green-500",
                                                    tx.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                                                    tx.status === 'rejected' && "bg-red-500/10 text-red-500",
                                                )}>
                                                    {tx.status === 'completed' && <CheckCircle2 size={12} />}
                                                    {tx.status === 'pending' && <Clock size={12} />}
                                                    {tx.status === 'rejected' && <XCircle size={12} />}
                                                    {tx.status}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
                                                {tx.tx_hash || "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Transactions;
