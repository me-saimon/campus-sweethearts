import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useReceivedInterests = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["received-interests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from("interest_requests")
        .select("*")
        .eq("to_user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!requests || requests.length === 0) return [];

      const fromUserIds = [...new Set(requests.map((r) => r.from_user_id))];
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", fromUserIds);
      if (pErr) throw pErr;

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return requests.map((r) => ({
        ...r,
        from_profile: profileMap.get(r.from_user_id) || null,
      }));
    },
  });
};

export const useSentInterests = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sent-interests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interest_requests")
        .select("*")
        .eq("from_user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });
};

export const usePendingCount = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["pending-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("interest_requests")
        .select("*", { count: "exact", head: true })
        .eq("to_user_id", user!.id)
        .eq("status", "pending");
      if (error) throw error;
      return count ?? 0;
    },
  });
};

export const useSendInterest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (toUserId: string) => {
      const { error } = await supabase
        .from("interest_requests")
        .insert({ from_user_id: user!.id, to_user_id: toUserId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent-interests"] });
    },
  });
};

export const useRespondInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
      const { error } = await supabase
        .from("interest_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-interests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-count"] });
    },
  });
};

export const useCanChat = (otherUserId: string | undefined) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["can-chat", user?.id, otherUserId],
    enabled: !!user && !!otherUserId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interest_requests")
        .select("*")
        .eq("status", "accepted")
        .or(
          `and(from_user_id.eq.${user!.id},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${user!.id})`
        );
      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
  });
};
