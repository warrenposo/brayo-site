-- 1. Create a public profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'admin')),
    balance NUMERIC(20, 2) DEFAULT 0.00,
    total_profits NUMERIC(20, 2) DEFAULT 0.00,
    performance NUMERIC(5, 2) DEFAULT 0.00,
    active_trades INTEGER DEFAULT 0,
    kyc_status TEXT DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create KYC details table (if not exists)
CREATE TABLE IF NOT EXISTS public.kyc_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_legal_name TEXT NOT NULL,
    dob DATE NOT NULL,
    id_number TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    id_front_url TEXT,
    id_back_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create transactions table (if not exists)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('deposit', 'withdrawal')),
    coin TEXT NOT NULL,
    amount NUMERIC(20, 8) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create ticket messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies (Drop first to avoid "already exists" errors)

-- Helper function to check if user is admin (non-recursive)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT (user_type = 'admin')
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update profiles" ON public.profiles;
CREATE POLICY "Admin can update profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- KYC Details Policies
DROP POLICY IF EXISTS "Users can view own KYC" ON public.kyc_details;
CREATE POLICY "Users can view own KYC" ON public.kyc_details
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own KYC" ON public.kyc_details;
CREATE POLICY "Users can insert own KYC" ON public.kyc_details
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can view all KYC" ON public.kyc_details;
CREATE POLICY "Admin can view all KYC" ON public.kyc_details
    FOR SELECT USING (public.is_admin());

-- Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
CREATE POLICY "Users can insert transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage all transactions" ON public.transactions;
CREATE POLICY "Admin can manage all transactions" ON public.transactions
    FOR ALL USING (public.is_admin());

-- Support Tickets Policies
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tickets" ON public.support_tickets;
CREATE POLICY "Users can insert own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage all tickets" ON public.support_tickets;
CREATE POLICY "Admin can manage all tickets" ON public.support_tickets
    FOR ALL USING (public.is_admin());

-- Ticket Messages Policies
DROP POLICY IF EXISTS "Users can view messages for own tickets" ON public.ticket_messages;
CREATE POLICY "Users can view messages for own tickets" ON public.ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets
            WHERE id = ticket_id AND user_id = auth.uid()
        ) OR public.is_admin()
    );

DROP POLICY IF EXISTS "Users can insert messages for own tickets" ON public.ticket_messages;
CREATE POLICY "Users can insert messages for own tickets" ON public.ticket_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.support_tickets
            WHERE id = ticket_id AND user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 8. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, user_type)
    VALUES (
        NEW.id,
        NEW.email,
        CASE WHEN LOWER(NEW.email) = LOWER('Warrenokumu98@gmail.com') THEN 'admin' ELSE 'user' END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
