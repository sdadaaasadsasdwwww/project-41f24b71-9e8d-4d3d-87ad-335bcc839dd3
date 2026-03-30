
-- Fix 1: Restrict profile UPDATE to authenticated role only
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Fix 2: The INSERT policy on user_roles already checks has_role(auth.uid(), 'admin').
-- has_role returns false when no matching row exists, so an empty table does NOT allow escalation.
-- However, to add defense-in-depth, add a WITH CHECK ensuring the inserted user_id is not the caller themselves
-- (admins assign roles to others, or we keep it as-is since has_role correctly blocks non-admins).
-- The real fix: ensure has_role returns false on empty table (it does - EXISTS returns false).
-- No SQL change needed for #2, but let's verify by tightening the policy.
