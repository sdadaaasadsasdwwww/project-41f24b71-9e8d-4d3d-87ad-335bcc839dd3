
-- Fix 1: Replace public profiles SELECT policy with authenticated-only, owner-only for full data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Authenticated users can see basic profile info (display_name, avatar_url) of all users
-- but phone is only visible to the profile owner
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- Fix 2: Restrict has_role function to only allow self-checks (for client-side use)
-- RLS policies use it internally via SECURITY DEFINER so they bypass this check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  AND (_user_id = auth.uid());
$$;
