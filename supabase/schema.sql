-- Initial Database Schema for ESportHub

-- Create custom types for roles
CREATE TYPE public.organization_role AS ENUM ('SUPER_ADMIN', 'OWNER', 'ADMIN', 'MODERATOR', 'VIEWER');

-- 1. Profiles Table (extends Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Organizations Table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Members Table (Many-to-Many between Profiles and Organizations)
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role organization_role NOT NULL DEFAULT 'VIEWER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, profile_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id );

CREATE POLICY "Super admin can bypass profiles"
    ON public.profiles FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- Organizations Policies
CREATE POLICY "Organizations are viewable by everyone."
    ON public.organizations FOR SELECT
    USING ( true );

CREATE POLICY "Authenticated users can create organizations."
    ON public.organizations FOR INSERT
    WITH CHECK ( auth.uid() IS NOT NULL );

CREATE POLICY "Organization owners and admins can update organization."
    ON public.organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.members
            WHERE members.organization_id = organizations.id
            AND members.profile_id = auth.uid()
            AND members.role IN ('OWNER', 'ADMIN', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Super admin can bypass organizations"
    ON public.organizations FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

CREATE POLICY "Members are viewable by everyone."
    ON public.members FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own membership"
    ON public.members FOR INSERT
    WITH CHECK ( auth.uid() = profile_id );

CREATE POLICY "Org admins can update members"
    ON public.members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.members m
            WHERE m.organization_id = members.organization_id
            AND m.profile_id = auth.uid()
            AND m.role IN ('OWNER', 'ADMIN', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Org admins can delete members"
    ON public.members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.members m
            WHERE m.organization_id = members.organization_id
            AND m.profile_id = auth.uid()
            AND m.role IN ('OWNER', 'ADMIN', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Super admin can bypass members"
    ON public.members FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- Function to handle new user signup and create a profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- PHASE 3 SCHEMA: Form Builder
-- ==========================================

-- 4. Forms Table
CREATE TABLE public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    banner_url TEXT,
    is_published BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- 5. Sections Table
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Fields Table
CREATE TABLE public.fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- e.g., 'TEXT', 'EMAIL', 'NUMBER', 'BGMI_UID'
    label TEXT NOT NULL,
    placeholder TEXT,
    required BOOLEAN DEFAULT false,
    options JSONB DEFAULT '[]'::jsonb,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for Phase 3 tables
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

-- Forms Policies
CREATE POLICY "Forms are viewable by everyone if published or by org members."
    ON public.forms FOR SELECT
    USING (
        is_published = true OR 
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = forms.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Org members can create forms."
    ON public.forms FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = forms.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Org members can update forms."
    ON public.forms FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = forms.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass forms"
    ON public.forms FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- Sections Policies
CREATE POLICY "Sections are viewable by everyone if form is published or by org members."
    ON public.sections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms 
            WHERE forms.id = sections.form_id 
            AND (
                forms.is_published = true OR 
                EXISTS (
                    SELECT 1 FROM public.members 
                    WHERE members.organization_id = forms.organization_id 
                    AND members.profile_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Org members can manage sections."
    ON public.sections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.forms 
            JOIN public.members ON members.organization_id = forms.organization_id
            WHERE forms.id = sections.form_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass sections"
    ON public.sections FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- Fields Policies
CREATE POLICY "Fields are viewable by everyone if form is published or by org members."
    ON public.fields FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.sections
            JOIN public.forms ON forms.id = sections.form_id
            WHERE sections.id = fields.section_id 
            AND (
                forms.is_published = true OR 
                EXISTS (
                    SELECT 1 FROM public.members 
                    WHERE members.organization_id = forms.organization_id 
                    AND members.profile_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Org members can manage fields."
    ON public.fields FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.sections
            JOIN public.forms ON forms.id = sections.form_id
            JOIN public.members ON members.organization_id = forms.organization_id
            WHERE sections.id = fields.section_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass fields"
    ON public.fields FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- ==========================================
-- PHASE 4 SCHEMA: Submissions
-- ==========================================

-- 7. Submissions Table
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_status TEXT DEFAULT 'NOT_REQUIRED', -- 'NOT_REQUIRED', 'PENDING', 'SUCCESS', 'FAILED'
    payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a submission"
    ON public.submissions FOR INSERT
    WITH CHECK ( true );

CREATE POLICY "Org members can view submissions"
    ON public.submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms
            JOIN public.members ON members.organization_id = forms.organization_id
            WHERE forms.id = submissions.form_id
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass submissions"
    ON public.submissions FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );

-- ==========================================
-- PHASE 5 SCHEMA: Payments
-- ==========================================

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert payments"
    ON public.payments FOR INSERT
    WITH CHECK ( true );

CREATE POLICY "Anyone can update their own payment"
    ON public.payments FOR UPDATE
    USING ( true );

CREATE POLICY "Org members can view payments"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.submissions
            JOIN public.forms ON forms.id = submissions.form_id
            JOIN public.members ON members.organization_id = forms.organization_id
            WHERE submissions.id = payments.submission_id
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass payments"
    ON public.payments FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );
