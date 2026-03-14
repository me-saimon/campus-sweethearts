-- Add student_id_url and verified columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id_url text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Create student_ids storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('student_ids', 'student_ids', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for student_ids bucket: users can upload their own
CREATE POLICY "Users can upload student ID" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'student_ids' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own student ID" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'student_ids' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own student ID" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'student_ids' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Admins can view all student IDs
CREATE POLICY "Admins can view all student IDs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'student_ids' AND public.has_role(auth.uid(), 'admin'));
