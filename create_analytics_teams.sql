CREATE TABLE IF NOT EXISTS public.analytics_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    form_id UUID,
    organization_id UUID,
    team_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    in_game_name TEXT,
    discord_tag TEXT,
    payment_status TEXT,
    raw_data JSONB
);

ALTER TABLE public.analytics_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics_teams" ON public.analytics_teams
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.id = auth.uid()
        )
    );
