import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Shield, Check, X, CreditCard, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles" as any)
        .select("*")
        .eq("user_id", user!.id)
        .eq("role", "admin");
      if (error) throw error;
      return (data as any[])?.length > 0;
    },
  });
};

const usePendingPurchases = () => {
  return useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("connect_purchases" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Fetch profile names
      const userIds = [...new Set((data as any[]).map((d: any) => d.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, avatar_url").in("user_id", userIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      return (data as any[]).map((d: any) => ({ ...d, profile: profileMap.get(d.user_id) }));
    },
  });
};

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: purchases } = usePendingPurchases();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  if (!loading && !user) return <Navigate to="/login" />;
  if (!adminLoading && !isAdmin) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="pt-24 text-center"><h2 className="text-2xl font-display font-bold text-destructive">Access Denied</h2><p className="text-muted-foreground mt-2">You don't have admin privileges.</p></div>
    </div>
  );

  const filtered = purchases?.filter((p: any) => filter === "all" || p.status === filter) || [];
  const pendingCount = purchases?.filter((p: any) => p.status === "pending").length || 0;

  const handleApprove = async (purchase: any) => {
    try {
      // Update purchase status
      const { error: updateErr } = await supabase
        .from("connect_purchases" as any)
        .update({ status: "approved" } as any)
        .eq("id", purchase.id);
      if (updateErr) throw updateErr;

      // Add credits to user
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("interest_credits" as any)
        .eq("user_id", purchase.user_id)
        .single();
      
      const currentCredits = (currentProfile as any)?.interest_credits || 0;
      const { error: creditErr } = await supabase
        .from("profiles")
        .update({ interest_credits: currentCredits + purchase.credits } as any)
        .eq("user_id", purchase.user_id);
      if (creditErr) throw creditErr;

      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast({ title: "Approved ✅", description: `${purchase.credits} credits added to user.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleReject = async (purchase: any) => {
    try {
      const { error } = await supabase
        .from("connect_purchases" as any)
        .update({ status: "rejected" } as any)
        .eq("id", purchase.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast({ title: "Rejected", description: "Purchase has been rejected." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />

        <div className="relative">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground drop-shadow-md">
                <Shield className="w-8 h-8 inline mr-2" /> Admin <span className="text-secondary">Panel</span>
              </h1>
              <p className="text-primary-foreground/80 mt-1">Manage connect purchases and user credits</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Purchases", value: purchases?.length || 0, icon: CreditCard, color: "text-primary" },
                { label: "Pending", value: pendingCount, icon: Clock, color: "text-accent" },
                { label: "Approved", value: purchases?.filter((p: any) => p.status === "approved").length || 0, icon: CheckCircle, color: "text-green-600" },
                { label: "Rejected", value: purchases?.filter((p: any) => p.status === "rejected").length || 0, icon: X, color: "text-destructive" },
              ].map((s, i) => (
                <Card key={i} className="shadow-card border-none">
                  <CardContent className="p-4">
                    <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(["all", "pending", "approved", "rejected"] as const).map(f => (
                <Button key={f} variant={filter === f ? "hero" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                  {f} {f === "pending" && pendingCount > 0 && <Badge className="ml-1 bg-destructive text-destructive-foreground text-xs">{pendingCount}</Badge>}
                </Button>
              ))}
            </div>

            {/* Purchases List */}
            <div className="space-y-4">
              {filtered.length === 0 && (
                <Card className="shadow-card border-none"><CardContent className="p-8 text-center text-muted-foreground">No purchases found.</CardContent></Card>
              )}
              {filtered.map((purchase: any, i: number) => (
                <motion.div key={purchase.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card border-none">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{purchase.profile?.name || "Unknown User"}</span>
                            <Badge variant={purchase.status === "pending" ? "secondary" : purchase.status === "approved" ? "default" : "destructive"}
                              className={purchase.status === "approved" ? "bg-green-100 text-green-700" : ""}>
                              {purchase.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            <p>Package: <span className="font-medium text-foreground">{purchase.package_name}</span> — BDT {purchase.amount}</p>
                            <p>bKash TXN: <span className="font-mono font-medium text-foreground">{purchase.bkash_txn_id}</span></p>
                            <p>Credits: {purchase.credits} — {new Date(purchase.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        {purchase.status === "pending" && (
                          <div className="flex gap-2">
                            <Button variant="hero" size="sm" onClick={() => handleApprove(purchase)}>
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleReject(purchase)} className="text-destructive hover:bg-destructive/10">
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
