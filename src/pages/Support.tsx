import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'closed';
    created_at: string;
}

interface Message {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
}

const Support = () => {
    const { profile } = useProfile();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTickets = async () => {
        if (!profile) return;
        const { data, error } = await supabase
            .from("support_tickets")
            .select("*")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false });

        if (!error && data) setTickets(data);
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
        fetchTickets();
    }, [profile]);

    useEffect(() => {
        if (selectedTicket) {
            fetchMessages(selectedTicket.id);
            // Subscribe to new messages
            const channel = supabase
                .channel(`ticket_${selectedTicket.id}`)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${selectedTicket.id}` },
                    (payload) => {
                        setMessages(prev => [...prev, payload.new as Message]);
                    }
                )
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, [selectedTicket]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile || !subject || !newMessage) return;
        setLoading(true);

        try {
            const { data: ticket, error: ticketError } = await supabase
                .from("support_tickets")
                .insert({ user_id: profile.id, subject })
                .select()
                .single();

            if (ticketError) throw ticketError;

            const { error: messageError } = await supabase
                .from("ticket_messages")
                .insert({
                    ticket_id: ticket.id,
                    sender_id: profile.id,
                    message: newMessage
                });

            if (messageError) throw messageError;

            toast.success("Ticket created successfully!");
            setSubject("");
            setNewMessage("");
            fetchTickets();
        } catch (error: any) {
            toast.error("Failed to create ticket: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile || !selectedTicket || !newMessage) return;

        try {
            const { error } = await supabase
                .from("ticket_messages")
                .insert({
                    ticket_id: selectedTicket.id,
                    sender_id: profile.id,
                    message: newMessage
                });

            if (error) throw error;
            setNewMessage("");
        } catch (error: any) {
            toast.error("Failed to send message: " + error.message);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
                    <p className="text-muted-foreground text-sm">Need help? Open a ticket to chat with our support team.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ticket List */}
                    <div className="space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Tickets</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                                    {tickets.length === 0 ? (
                                        <p className="p-8 text-center text-sm text-muted-foreground">No tickets yet.</p>
                                    ) : (
                                        tickets.map(ticket => (
                                            <button
                                                key={ticket.id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className={`w-full p-4 text-left hover:bg-muted transition-colors ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-sm truncate pr-2">{ticket.subject}</span>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${ticket.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                                                    <Clock size={10} />
                                                    {format(new Date(ticket.created_at), 'MMM dd, HH:mm')}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {!selectedTicket && (
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-sm">Create New Ticket</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateTicket} className="space-y-4">
                                        <Input
                                            placeholder="Subject"
                                            value={subject}
                                            onChange={e => setSubject(e.target.value)}
                                            required
                                        />
                                        <Textarea
                                            placeholder="Explain your issue..."
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            required
                                            className="min-h-[100px]"
                                        />
                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? "Creating..." : "Submit Ticket"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                        {selectedTicket ? (
                            <Card className="bg-card border-border h-[650px] flex flex-col">
                                <CardHeader className="border-b border-border flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                                        <CardDescription className="text-xs uppercase font-bold tracking-widest text-green-500/80">Support Chat Active</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>Back</Button>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender_id === profile?.id ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'}`}>
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                                <p className={`text-[9px] mt-1 opacity-70 ${msg.sender_id === profile?.id ? 'text-right' : 'text-left'}`}>
                                                    {format(new Date(msg.created_at), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                                <div className="p-4 border-t border-border">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="submit" size="icon">
                                            <Send size={18} />
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/30 rounded-lg border border-border border-dashed">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <MessageSquare size={32} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Select a ticket to chat</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-sm">Select one of your existing tickets from the list or create a new one to speak with our support representatives.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Support;
