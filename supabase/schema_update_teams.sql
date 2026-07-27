-- Create Teams Table for manual and dynamic teams
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    source TEXT DEFAULT 'MANUAL', -- 'MANUAL' or 'FORM_SUBMISSION'
    submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policies for Teams
CREATE POLICY "Org members can view teams"
    ON public.teams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = teams.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Org members can insert teams"
    ON public.teams FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = teams.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Org members can update teams"
    ON public.teams FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = teams.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Org members can delete teams"
    ON public.teams FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.organization_id = teams.organization_id 
            AND members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Super admin can bypass teams"
    ON public.teams FOR ALL
    USING ( (auth.jwt() ->> 'email') = 'scrimsgame8@gmail.com' );
