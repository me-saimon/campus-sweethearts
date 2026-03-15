
-- Add reply_to column to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES public.messages(id);

-- Prevent updates/deletes on messages (immutability)
CREATE OR REPLACE FUNCTION public.prevent_message_modification()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  RAISE EXCEPTION 'Messages cannot be modified after sending';
  RETURN NULL;
END;
$$;

CREATE TRIGGER prevent_message_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_message_modification();

CREATE TRIGGER prevent_message_delete
  BEFORE DELETE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_message_modification();
