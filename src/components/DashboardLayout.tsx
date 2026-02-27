import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, History, ShieldEllipsis, LogOut, Menu, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProfile } from "@/hooks/useProfile";

const baseNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Deposit", icon: ArrowUpCircle, href: "/deposit" },
    { label: "Withdraw", icon: ArrowDownCircle, href: "/withdraw" },
    { label: "Transactions", icon: History, href: "/transactions" },
    { label: "KYC", icon: ShieldEllipsis, href: "/kyc" },
    { label: "Support", icon: MessageSquare, href: "/support" }
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { profile } = useProfile();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const navItems = profile?.user_type === "admin"
        ? [...baseNavItems, { label: "Admin Console", icon: Settings, href: "/admin" }]
        : baseNavItems;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="p-6 text-center">
                <h1 className="text-xl font-black text-primary tracking-[0.2em]">BRAYO SITE</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Trading Platform</p>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-4 h-11 px-4 rounded-xl transition-all duration-300",
                            location.pathname === item.href
                                ? "bg-primary/10 text-primary font-bold shadow-[0_0_20px_rgba(var(--primary),0.1)] border-r-4 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => {
                            navigate(item.href);
                            setIsMobileOpen(false);
                        }}
                    >
                        <item.icon size={18} className={cn(location.pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-sm">{item.label}</span>
                    </Button>
                ))}
            </nav>
            <div className="p-4 space-y-2">
                <div className="px-4 py-3 bg-muted/30 rounded-xl border border-border/50 mb-2">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">Connected Account</p>
                    <p className="text-[10px] font-medium truncate text-foreground">{profile?.email}</p>
                </div>
                <Button variant="ghost" className="w-full justify-start gap-4 h-11 px-4 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span className="text-sm font-semibold">Logout</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-72 flex flex-col min-h-screen relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
                    <h1 className="text-lg font-black text-primary tracking-widest">BRAYO SITE</h1>
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                <Menu className="text-primary" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72 border-r border-border bg-card">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                <div className="p-6 md:p-10 flex-1 max-w-7xl mx-auto w-full">
                    {children}
                </div>

                {/* Decorative Elements */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
            </main>
        </div>
    );
};

export default DashboardLayout;
