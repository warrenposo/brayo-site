import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useProfile, Profile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, CreditCard, ShieldCheck, MessageSquare, Send, Clock, ChevronRight, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'closed';
    created_at: string;
    user_id: string;
    profiles?: {
        email: string;
    };
}

interface Message {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
}

const Admin = () => {
    const { profile: adminProfile, loading: profileLoading } = useProfile();
    const [users, setUsers] = useState<Profile[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [newBalance, setNewBalance] = useState<string>("");

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && data) setUsers(data);
    };

    const fetchTickets = async () => {
        const { data, error } = await supabase
            .from("support_tickets")
            .select("*, profiles(email)")
            .order("created_at", { ascending: false });
        if (!error && data) setTickets(data as any);
    };

    const fetchMessages = async (ticketId: string) => {
        const { data, error } = await supabase
            .from("ticket_messages")
            .select("*")
            .eq("ticket_id", ticketId)
            .order("created_at", { ascending: true });
        if (!error && data) setMessages(data);
    };

    useEffect(() => {
        if (adminProfile?.user_type === "admin") {
            fetchUsers();
            fetchTickets();
            setLoading(false);
        }
    }, [adminProfile]);

    useEffect(() => {
        if (selectedTicket) {
            fetchMessages(selectedTicket.id);
            const channel = supabase
                .channel(`admin_ticket_${selectedTicket.id}`)
                .on("postgres_changes", { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${selectedTicket.id}` },
                    (payload) => {
                        setMessages(prev => [...prev, payload.new as Message]);
                    })
                .subscribe();
            return () => { supabase.removeChannel(channel); };
        }
    }, [selectedTicket]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminProfile || !selectedTicket || !newMessage) return;
        try {
            const { error } = await supabase
                .from("ticket_messages")
                .insert({ ticket_id: selectedTicket.id, sender_id: adminProfile.id, message: newMessage });
            if (error) throw error;
            setNewMessage("");
        } catch (error: any) {
            toast.error("Failed to send: " + error.message);
        }
    };

    const handleUpdateBalance = async () => {
        if (!selectedUser || !newBalance) return;
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ balance: parseFloat(newBalance) })
                .eq("id", selectedUser.id);
            if (error) throw error;
            toast.success(`Updated balance for ${selectedUser.email}`);
            fetchUsers();
            setSelectedUser(null);
            setNewBalance("");
        } catch (error: any) {
            toast.error("Failed to update: " + error.message);
        }
    };

    const handleUpdateKYC = async (userId: string, status: Profile["kyc_status"]) => {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ kyc_status: status })
                .eq("id", userId);
            if (error) throw error;
            toast.success(`Updated KYC to ${status}`);
            fetchUsers();
        } catch (error: any) {
            toast.error("Failed: " + error.message);
        }
    };

    if (profileLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Authenticating Admin Session...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!adminProfile || adminProfile.user_type !== "admin") {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <ShieldCheck size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-red-500">Access Denied</h2>
                    <p className="text-muted-foreground text-sm">This area is reserved for administrators only.</p>
                    <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-border text-[10px] font-mono">
                        <p>ID: {adminProfile?.id || 'NULL'}</p>
                        <p>EMAIL: {adminProfile?.email || 'NULL'}</p>
                        <p>TYPE: {adminProfile?.user_type || 'NULL'}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground">Admin Console</h2>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Session active as <strong>{adminProfile.email}</strong>
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { fetchUsers(); fetchTickets(); }} className="gap-2 font-bold uppercase tracking-widest text-[10px]">
                        <Activity size={14} /> Refresh Data
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-card border-border/50 hover:border-primary/50 transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Total Platform Users</CardTitle>
                            <Users size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{users.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 hover:border-primary/50 transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Pending Support</CardTitle>
                            <MessageSquare size={16} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{tickets.filter(t => t.status === 'open').length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 hover:border-primary/50 transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Pending Verification</CardTitle>
                            <ShieldCheck size={16} className="text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{users.filter(u => u.kyc_status === 'pending').length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="space-y-8">
                    <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl">
                        <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest px-6">User Database</TabsTrigger>
                        <TabsTrigger value="tickets" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest px-6">Support Portal</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card className="bg-card border-border overflow-hidden shadow-2xl shadow-primary/5">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="text-[10px] uppercase font-black tracking-widest py-4">User Details</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black tracking-widest">Portfolio Balance</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black tracking-widest">KYC Status</TableHead>
                                            <TableHead className="text-right text-[10px] uppercase font-black tracking-widest pr-6">Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/20 border-border/50 transition-colors">
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">{user.full_name || 'Anonymous User'}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-black text-xs text-primary">{user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[9px] opacity-70">USDT</span></div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border",
                                                        user.kyc_status === 'verified' && "bg-green-500/10 text-green-500 border-green-500/20",
                                                        user.kyc_status === 'pending' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse",
                                                        user.kyc_status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
                                                        user.kyc_status === 'unverified' && "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {user.kyc_status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 space-x-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-lg border-primary/20 hover:bg-primary/5" onClick={() => { setSelectedUser(user); setNewBalance(user.balance.toString()); }}>
                                                                <CreditCard size={14} className="mr-2" /> Adjust Funds
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-card border-border text-foreground">
                                                            <DialogHeader className="pb-4 border-b border-border/50">
                                                                <DialogTitle className="text-xl font-black">Capital Adjustment</DialogTitle>
                                                                <DialogDescription className="text-xs uppercase font-bold tracking-widest opacity-60">{user.email}</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-8 space-y-6">
                                                                <div className="space-y-3">
                                                                    <Label className="text-[10px] uppercase font-black tracking-widest text-primary">New Ledger Balance (USDT)</Label>
                                                                    <Input type="number" step="100" className="h-12 text-2xl font-black bg-muted/50 border-border" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <DialogFooter className="pt-4 border-t border-border/50">
                                                                <Button onClick={handleUpdateBalance} className="w-full h-12 font-black uppercase tracking-widest rounded-xl">Commit Ledger Update</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    {user.kyc_status === 'pending' && (
                                                        <Button variant="secondary" size="sm" className="h-8 text-[10px] font-black bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg" onClick={() => handleUpdateKYC(user.id, 'verified')}>Approve ID</Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tickets">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
                            <Card className="lg:col-span-4 bg-card border-border overflow-hidden flex flex-col shadow-xl">
                                <CardHeader className="bg-muted/30 border-b border-border py-4">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">Help Desk Inbox</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 flex-1 overflow-hidden">
                                    <div className="divide-y divide-border h-full overflow-y-auto">
                                        {tickets.map(ticket => (
                                            <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={cn("w-full p-5 text-left hover:bg-muted/50 transition-all border-l-4", selectedTicket?.id === ticket.id ? "bg-primary/5 border-primary" : "border-transparent")}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-black text-foreground truncate max-w-[180px]">{ticket.subject}</span>
                                                    <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border", ticket.status === 'open' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground border-border')}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[10px] text-muted-foreground font-mono truncate">{ticket.profiles?.email}</p>
                                                    <div className="flex items-center text-[9px] text-muted-foreground/60 gap-1 mt-1 font-bold">
                                                        <Clock size={10} /> {format(new Date(ticket.created_at), 'MMM dd | HH:mm')}
                                                        <ChevronRight size={10} className="ml-auto opacity-40" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-8 bg-card border-border overflow-hidden flex flex-col shadow-xl">
                                {selectedTicket ? (
                                    <>
                                        <CardHeader className="border-b border-border py-5 px-8 flex flex-row items-center justify-between bg-muted/10 backdrop-blur-sm">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-black tracking-tight">{selectedTicket.subject}</CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                                    <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary opacity-80">{selectedTicket.profiles?.email}</CardDescription>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border border-border/50 hover:bg-muted" onClick={() => setSelectedTicket(null)}>Dismiss Chat</Button>
                                        </CardHeader>
                                        <CardContent className="flex-1 overflow-y-auto p-8 space-y-4 bg-card/50">
                                            {messages.map((msg) => (
                                                <div key={msg.id} className={cn("flex group", msg.sender_id === adminProfile.id ? "justify-end" : "justify-start")}>
                                                    <div className={cn("max-w-[75%] space-y-1", msg.sender_id === adminProfile.id ? "items-end" : "items-start")}>
                                                        <div className={cn("p-4 rounded-2xl text-[13px] font-medium shadow-sm leading-relaxed", msg.sender_id === adminProfile.id ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20" : "bg-muted border border-border/50 text-foreground rounded-tl-none")}>
                                                            {msg.message}
                                                        </div>
                                                        <p className={cn("text-[9px] font-black opacity-40 uppercase tracking-widest px-1", msg.sender_id === adminProfile.id ? "text-right" : "text-left")}>{format(new Date(msg.created_at), 'HH:mm')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                        <div className="p-6 border-t border-border bg-muted/20">
                                            <form onSubmit={handleSendMessage} className="flex gap-3 bg-card p-2 rounded-2xl border border-border/50 focus-within:border-primary/50 transition-all shadow-lg">
                                                <Input placeholder="Message response to user..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 text-sm bg-transparent border-none focus-visible:ring-0 px-4 h-12" />
                                                <Button type="submit" size="icon" className="shrink-0 h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"><Send size={20} className="mr-0.5" /></Button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
                                        <MessageSquare size={48} className="text-primary opacity-20" />
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black uppercase tracking-[0.3em] opacity-40">Command Center</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Select an active transmission to respond</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Admin;
