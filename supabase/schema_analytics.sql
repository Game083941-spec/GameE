-- ==========================================
-- ANALYTICS TABLES
-- These tables store persistent data for internal analysis
-- and are not affected by cascading deletes from the main app.
-- ==========================================

-- 1. Analytics Users Table (Tracks all submissions)
CREATE TABLE public.analytics_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_form_id UUID, -- Kept as a simple UUID (no foreign key) so it doesn't cascade delete
    email TEXT,
    phone TEXT,
    responses JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS but restrict to Super Admin only
ALTER TABLE public.analytics_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can bypass analytics users"
    ON public.analytics_users FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- 2. Analytics Payments Table (Tracks all payments)
CREATE TABLE public.analytics_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_submission_id UUID, -- No foreign key constraint to prevent cascade delete
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS but restrict to Super Admin only
ALTER TABLE public.analytics_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can bypass analytics payments"
    ON public.analytics_payments FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- ==========================================
-- TRIGGERS to auto-populate analytics tables
-- ==========================================

-- Function to copy submissions to analytics_users
CREATE OR REPLACE FUNCTION public.handle_new_submission_analytics()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.analytics_users (original_form_id, responses, created_at)
    VALUES (NEW.form_id, NEW.responses, NEW.created_at);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for submissions
CREATE TRIGGER on_submission_created_analytics
    AFTER INSERT ON public.submissions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_submission_analytics();


-- Function to copy payments to analytics_payments
CREATE OR REPLACE FUNCTION public.handle_new_payment_analytics()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.analytics_payments (
        original_submission_id, 
        razorpay_order_id, 
        razorpay_payment_id, 
        amount, 
        currency, 
        status, 
        created_at
    )
    VALUES (
        NEW.submission_id, 
        NEW.razorpay_order_id, 
        NEW.razorpay_payment_id, 
        NEW.amount, 
        NEW.currency, 
        NEW.status, 
        NEW.created_at
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for payments
CREATE TRIGGER on_payment_created_analytics
    AFTER INSERT ON public.payments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_payment_analytics();
