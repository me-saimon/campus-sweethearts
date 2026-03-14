import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Shield, Check, X, CreditCard, Users, Clock, CheckCircle, Eye, ShieldCheck, ShieldX, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
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
        .from("connect_purchases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set((data as any[]).map((d: any) => d.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, avatar_url").in("user_id", userIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      return (data as any[]).map((d: any) => ({ ...d, profile: profileMap.get(d.user_id) }));
    },
  });
};

const useAllProfiles = () => {
  return useQuery({
    queryKey: ["admin-all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: purchases } = usePendingPurchases();
  const { data: allProfiles } = useAllProfiles();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [purchaseFilter, setPurchaseFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  if (!loading && !user) return <Navigate to="/login" />;
  if (!adminLoading && !isAdmin) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="pt-24 text-center"><h2 className="text-2xl font-display font-bold text-destructive">Access Denied</h2><p className="text-muted-foreground mt-2">You don't have admin privileges.</p></div>
    </div>
  );

  const filteredPurchases = purchases?.filter((p: any) => purchaseFilter === "all" || p.status === purchaseFilter) || [];
  const pendingPurchaseCount = purchases?.filter((p: any) => p.status === "pending").length || 0;

  const unverifiedProfiles = allProfiles?.filter((p: any) => !p.verified && p.student_id_url) || [];
  const verifiedProfiles = allProfiles?.filter((p: any) => p.verified) || [];

  const handleApprovePurchase = async (purchase: any) => {
    try {
      const { error: updateErr } = await supabase.from("connect_purchases").update({ status: "approved" } as any).eq("id", purchase.id);
      if (updateErr) throw updateErr;
      const { data: currentProfile } = await supabase.from("profiles").select("interest_credits").eq("user_id", purchase.user_id).single();
      const currentCredits = (currentProfile as any)?.interest_credits || 0;
      const { error: creditErr } = await supabase.from("profiles").update({ interest_credits: currentCredits + purchase.credits } as any).eq("user_id", purchase.user_id);
      if (creditErr) throw creditErr;
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast({ title: "Approved ✅", description: `${purchase.credits} credits added.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRejectPurchase = async (purchase: any) => {
    try {
      const { error } = await supabase.from("connect_purchases").update({ status: "rejected" } as any).eq("id", purchase.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast({ title: "Rejected", description: "Purchase rejected." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleVerifyUser = async (profileUserId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ verified: true } as any).eq("user_id", profileUserId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] });
      toast({ title: "User Verified ✅", description: "Profile is now verified." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRejectVerification = async (profileUserId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ verified: false, student_id_url: "" } as any).eq("user_id", profileUserId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] });
      toast({ title: "Verification Rejected", description: "Student ID has been rejected." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getStudentIdUrl = (userId: string) => {
    // Generate signed URL for admin to view
    const profile = allProfiles?.find(p => p.user_id === userId);
    return (profile as any)?.student_id_url || "";
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
              <p className="text-primary-foreground/80 mt-1">Manage user verification and connect purchases</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Users", value: allProfiles?.length || 0, icon: Users, color: "text-primary" },
                { label: "Pending Verification", value: unverifiedProfiles.length, icon: ShieldX, color: "text-accent" },
                { label: "Verified Users", value: verifiedProfiles.length, icon: ShieldCheck, color: "text-green-600" },
                { label: "Pending Purchases", value: pendingPurchaseCount, icon: Clock, color: "text-destructive" },
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

            <Tabs defaultValue="verification" className="space-y-6">
              <TabsList className="bg-card border">
                <TabsTrigger value="verification">
                  User Verification {unverifiedProfiles.length > 0 && <Badge className="ml-2 bg-accent text-accent-foreground text-xs">{unverifiedProfiles.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="purchases">
                  Connect Purchases {pendingPurchaseCount > 0 && <Badge className="ml-2 bg-destructive text-destructive-foreground text-xs">{pendingPurchaseCount}</Badge>}
                </TabsTrigger>
              </TabsList>

              {/* Verification Tab */}
              <TabsContent value="verification" className="space-y-4">
                <h2 className="text-lg font-display font-bold">Pending Student ID Verification</h2>
                {unverifiedProfiles.length === 0 ? (
                  <Card className="shadow-card border-none"><CardContent className="p-8 text-center text-muted-foreground">No pending verifications.</CardContent></Card>
                ) : (
                  unverifiedProfiles.map((profile: any, i: number) => (
                    <motion.div key={profile.user_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="shadow-card border-none">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                {profile.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                                <AvatarFallback className="bg-gradient-hero text-primary-foreground font-display">{(profile.name || "U").charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{profile.name || "Unknown"}</p>
                                <p className="text-sm text-muted-foreground">{profile.university || "No university"} · {profile.department || "N/A"}</p>
                                <p className="text-xs text-muted-foreground">{profile.gender || "N/A"} · Age: {profile.age || "N/A"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {profile.student_id_url && (
                                <Button variant="outline" size="sm" onClick={() => window.open(profile.student_id_url, "_blank")}>
                                  <Image className="w-4 h-4 mr-1" /> View ID Card
                                </Button>
                              )}
                              <Button variant="hero" size="sm" onClick={() => handleVerifyUser(profile.user_id)}>
                                <Check className="w-4 h-4 mr-1" /> Verify
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleRejectVerification(profile.user_id)} className="text-destructive hover:bg-destructive/10">
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}

                <h2 className="text-lg font-display font-bold mt-8">Verified Users ({verifiedProfiles.length})</h2>
                {verifiedProfiles.length === 0 ? (
                  <Card className="shadow-card border-none"><CardContent className="p-8 text-center text-muted-foreground">No verified users yet.</CardContent></Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {verifiedProfiles.slice(0, 20).map((profile: any) => (
                      <Card key={profile.user_id} className="shadow-card border-none">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            {profile.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                            <AvatarFallback className="bg-gradient-hero text-primary-foreground text-sm font-display">{(profile.name || "U").charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile.university}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 text-xs"><ShieldCheck className="w-3 h-3 mr-0.5" /> Verified</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Purchases Tab */}
              <TabsContent value="purchases" className="space-y-4">
                <div className="flex gap-2 mb-4">
                  {(["all", "pending", "approved", "rejected"] as const).map(f => (
                    <Button key={f} variant={purchaseFilter === f ? "hero" : "outline"} size="sm" onClick={() => setPurchaseFilter(f)} className="capitalize">
                      {f} {f === "pending" && pendingPurchaseCount > 0 && <Badge className="ml-1 bg-destructive text-destructive-foreground text-xs">{pendingPurchaseCount}</Badge>}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredPurchases.length === 0 && (
                    <Card className="shadow-card border-none"><CardContent className="p-8 text-center text-muted-foreground">No purchases found.</CardContent></Card>
                  )}
                  {filteredPurchases.map((purchase: any, i: number) => (
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
                                <Button variant="hero" size="sm" onClick={() => handleApprovePurchase(purchase)}>
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleRejectPurchase(purchase)} className="text-destructive hover:bg-destructive/10">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
