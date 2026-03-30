
-- Fix 1: Add policy so users can view their own roles (fixes app logic needing role checks)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Fix 2: Add restrictive UPDATE denial policy as defense-in-depth
CREATE POLICY "No one can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (false);
