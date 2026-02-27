import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    user_type: "user" | "admin";
    balance: number;
    total_profits: number;
    performance: number;
    active_trades: number;
    kyc_status: "unverified" | "pending" | "verified" | "rejected";
}

export const useProfile = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setProfile(null);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error: any) {
            console.error("Error fetching profile:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();

        const channel = supabase
            .channel(`profile_${Math.random()}`)
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "profiles" },
                (payload) => {
                    setProfile((currentProfile) => {
                        if (currentProfile && payload.new.id === currentProfile.id) {
                            return payload.new as Profile;
                        }
                        return currentProfile;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { profile, loading, refreshProfile: fetchProfile };
};
