
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_background jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_details jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_interests jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religious_practice jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS partner_preferences jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religious_preferences jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS relationship_views jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS guardian_info jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interest_credits integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skin_tone text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS physical_illness text DEFAULT '';

CREATE TABLE public.connect_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  bkash_txn_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.connect_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
ON public.connect_purchases FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
ON public.connect_purchases FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all purchases"
ON public.connect_purchases FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update purchases"
ON public.connect_purchases FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
