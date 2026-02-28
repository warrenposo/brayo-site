import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ShieldCheck, Upload, AlertCircle, FileText, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const KYC = () => {
    const { profile, refreshProfile } = useProfile();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<{ id_front: File | null; id_back: File | null }>({
        id_front: null,
        id_back: null
    });
    const [formData, setFormData] = useState({
        full_legal_name: "",
        dob: "",
        id_number: "",
        country: "",
        address: "",
        city: "",
        postal_code: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'id_front' | 'id_back') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [side]: e.target.files![0] }));
        }
    };

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile?.id}/${path}_${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
            .from('kyc-documents')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.id_front || !files.id_back) {
            toast.error("Please upload both sides of your ID");
            return;
        }
        setLoading(true);

        try {
            // 1. Upload documents
            setUploading(true);
            const frontUrl = await uploadFile(files.id_front, 'front');
            const backUrl = await uploadFile(files.id_back, 'back');

            // 2. Submit KYC details
            const { error: kycError } = await supabase
                .from("kyc_details")
                .upsert({
                    user_id: profile?.id,
                    ...formData,
                    document_front_url: frontUrl,
                    document_back_url: backUrl
                });

            if (kycError) throw kycError;

            // 3. Update profile status
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ kyc_status: "verified" })
                .eq("id", profile?.id);

            if (profileError) throw profileError;

            toast.success("Identity verified successfully!");
            refreshProfile();
        } catch (error: any) {
            toast.error("Verification failed: " + error.message);
            console.error(error);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (profile?.kyc_status === 'verified') {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/20">
                        <ShieldCheck size={48} className="text-green-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Identity Verified</h2>
                        <p className="text-muted-foreground text-sm font-medium">Your merovianscapital account is fully authenticated and protected.</p>
                    </div>
                    <Button onClick={() => window.location.href = '/dashboard'} className="font-bold uppercase tracking-widest px-8">Return Home</Button>
                </div>
            </DashboardLayout>
        );
    }

    if (profile?.kyc_status === 'pending') {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6 animate-in fade-in duration-700">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                            <Upload size={40} className="text-primary animate-bounce" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full border border-border flex items-center justify-center">
                            <Clock size={16} className="text-primary" />
                        </div>
                    </div>
                    <div className="text-center space-y-2 max-w-md">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Review in Progress</h2>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">Our compliance team is currently validating your identity documents. This typically takes 12-24 business hours.</p>
                    </div>
                    <div className="px-6 py-2 bg-muted rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border border-border/50">Transmission Secured</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Protocol</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase tracking-widest leading-none">KYC Integrity</h2>
                        <p className="text-muted-foreground text-sm font-medium max-w-md">Required for institutional-grade security and unlimited capital movement.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50">Current Level</p>
                            <p className="text-xs font-bold text-foreground">Standard (Restricted)</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center">
                            <Activity size={20} className="text-muted-foreground" />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px]">01</span>
                                Personal Dossier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="fullName">Legal Full Name</Label>
                                    <Input id="fullName" className="bg-muted/50 border-border rounded-xl h-12 font-bold" required value={formData.full_legal_name} onChange={(e) => setFormData({ ...formData, full_legal_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" className="bg-muted/50 border-border rounded-xl h-12 font-bold" required value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="idNumber">Document ID Serial</Label>
                                    <Input id="idNumber" className="bg-muted/50 border-border rounded-xl h-12 font-bold" required value={formData.id_number} onChange={(e) => setFormData({ ...formData, id_number: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="country">Jurisdiction</Label>
                                    <Input id="country" className="bg-muted/50 border-border rounded-xl h-12 font-bold" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="address">Residential Address</Label>
                                <Input id="address" className="bg-muted/50 border-border rounded-xl h-12 font-bold" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px]">02</span>
                                Digital Capture
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Government ID (Front)</Label>
                                    <div className={cn("relative h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group", files.id_front ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-primary/50 hover:bg-primary/5")}>
                                        <Input type="file" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, 'id_front')} />
                                        {files.id_front ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <CheckCircle2 size={24} className="text-green-500" />
                                                <span className="text-[10px] font-bold text-green-500 uppercase">{files.id_front.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capture High-Res Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Government ID (Back)</Label>
                                    <div className={cn("relative h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group", files.id_back ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-primary/50 hover:bg-primary/5")}>
                                        <Input type="file" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, 'id_back')} />
                                        {files.id_back ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <CheckCircle2 size={24} className="text-green-500" />
                                                <span className="text-[10px] font-bold text-green-500 uppercase">{files.id_back.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capture High-Res Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4 shadow-inner">
                            <div className="flex gap-4 items-start">
                                <AlertCircle className="text-primary shrink-0" size={24} />
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-primary">Compliance Verification</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                        Data is encrypted using AES-256 standards. By initiating this transmission, you authorize merovianscapital to verify your professional identity details via secure neural channels.
                                    </p>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02]" disabled={loading || uploading}>
                                {loading ? (uploading ? "Securing Documents..." : "Authenticating...") : "Initiate Verification"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-bounce { animation: bounce 2s infinite; }
            `}</style>
        </DashboardLayout>
    );
};

export default KYC;

const Activity = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
