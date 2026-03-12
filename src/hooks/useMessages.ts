import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
}

export const useMessages = (otherUserId: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", user?.id, otherUserId],
    enabled: !!user && !!otherUserId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user!.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user!.id})`
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Message[];
    },
  });

  useEffect(() => {
    if (!user || !otherUserId) return;

    const channel = supabase
      .channel(`chat:${user.id}:${otherUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as any;
          if (
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id)
          ) {
            queryClient.invalidateQueries({ queryKey: ["messages", user.id, otherUserId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, otherUserId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ receiverId, text }: { receiverId: string; text: string }) => {
      const { error } = await supabase
        .from("messages")
        .insert({ sender_id: user!.id, receiver_id: receiverId, text });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["messages", user!.id, vars.receiverId] });
      queryClient.invalidateQueries({ queryKey: ["chat-contacts"] });
    },
  });
};

export const useChatContacts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["chat-contacts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: accepted, error } = await supabase
        .from("interest_requests")
        .select("from_user_id, to_user_id")
        .eq("status", "accepted")
        .or(`from_user_id.eq.${user!.id},to_user_id.eq.${user!.id}`);
      if (error) throw error;
      if (!accepted || accepted.length === 0) return [];

      const otherIds = [...new Set(
        accepted.map((r) =>
          r.from_user_id === user!.id ? r.to_user_id : r.from_user_id
        )
      )];

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", otherIds);
      if (pErr) throw pErr;

      const contacts = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("text, created_at, sender_id")
            .or(
              `and(sender_id.eq.${user!.id},receiver_id.eq.${profile.user_id}),and(sender_id.eq.${profile.user_id},receiver_id.eq.${user!.id})`
            )
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            userId: profile.user_id,
            name: profile.name || "Anonymous",
            university: profile.university || "",
            avatarUrl: profile.avatar_url || "",
            lastMessage: lastMsg?.[0]?.text || "No messages yet",
            lastMessageTime: lastMsg?.[0]?.created_at || profile.created_at,
            initial: (profile.name || "A").charAt(0),
          };
        })
      );

      return contacts.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
    },
  });
};
