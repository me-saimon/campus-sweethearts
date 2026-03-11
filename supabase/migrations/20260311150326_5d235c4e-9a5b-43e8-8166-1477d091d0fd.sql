
-- Fix RLS policies: change from RESTRICTIVE to PERMISSIVE
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can send interest requests" ON public.interest_requests;
DROP POLICY IF EXISTS "Recipients can update interest request status" ON public.interest_requests;
DROP POLICY IF EXISTS "Users can view their own interest requests" ON public.interest_requests;

-- Recreate as permissive policies
CREATE POLICY "Users can view their own interest requests"
ON public.interest_requests FOR SELECT
TO authenticated
USING ((auth.uid() = from_user_id) OR (auth.uid() = to_user_id));

CREATE POLICY "Authenticated users can send interest requests"
ON public.interest_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Recipients can update interest request status"
ON public.interest_requests FOR UPDATE
TO authenticated
USING (auth.uid() = to_user_id);

-- Also fix profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Ensure the handle_new_user trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
