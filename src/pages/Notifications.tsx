import { motion } from "framer-motion";
import { Heart, Check, X, GraduationCap, MapPin, Clock, Bell, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { useReceivedInterests, useRespondInterest } from "@/hooks/useInterestRequests";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Notifications = () => {
  const { user, loading } = useAuth();
  const { data: requests, isLoading } = useReceivedInterests();
  const respondMutation = useRespondInterest();
  const navigate = useNavigate();

  if (!loading && !user) return <Navigate to="/login" />;

  const handleRespond = (id: string, status: "accepted" | "rejected") => {
    respondMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(
            status === "accepted"
              ? "MashaAllah! Interest accepted. You can now chat! 💚"
              : "Interest declined."
          );
        },
      }
    );
  };

  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
  const pastRequests = requests?.filter((r) => r.status !== "pending") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-24 pb-12">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-48" />
        <div className="absolute inset-0 islamic-pattern h-48" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-primary-foreground drop-shadow-md flex items-center gap-3">
              <Bell className="w-7 h-7" /> Notifications
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              Interest requests from people who want to connect with you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 pb-16 relative z-10">
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Pending Requests
              <Badge variant="secondary" className="bg-primary/10 text-primary">{pendingRequests.length}</Badge>
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((req: any, i: number) => {
                const profile = req.from_profile;
                return (
                  <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="shadow-card border border-primary/20 bg-card/95 backdrop-blur-sm hover:shadow-card-hover transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-14 h-14 cursor-pointer hover:scale-105 transition-transform" onClick={() => profile && navigate(`/profile/${profile.user_id}`)}>
                            {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                            <AvatarFallback className="bg-gradient-hero text-primary-foreground text-lg font-display font-bold">
                              {profile?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <Link to={profile ? `/profile/${profile.user_id}` : "#"} className="text-base font-semibold hover:text-primary transition-colors">
                              {profile?.name || "Unknown User"}
                            </Link>
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                              {profile?.university && (
                                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {profile.university}</span>
                              )}
                              {profile?.location && (
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(req.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={profile ? `/profile/${profile.user_id}` : "#"}>
                                <Eye className="w-4 h-4 mr-1" /> View Profile
                              </Link>
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleRespond(req.id, "rejected")} disabled={respondMutation.isPending}>
                                <X className="w-4 h-4" />
                              </Button>
                              <Button variant="hero" size="sm" onClick={() => handleRespond(req.id, "accepted")} disabled={respondMutation.isPending}>
                                <Check className="w-4 h-4 mr-1" /> Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {pastRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> Past Requests
            </h2>
            <div className="space-y-3">
              {pastRequests.map((req: any) => {
                const profile = req.from_profile;
                return (
                  <Card key={req.id} className="shadow-sm border-none bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold">
                            {profile?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Link to={profile ? `/profile/${profile.user_id}` : "#"} className="text-sm font-medium hover:text-primary transition-colors">
                            {profile?.name || "Unknown"}
                          </Link>
                          <p className="text-xs text-muted-foreground">{profile?.university}</p>
                        </div>
                        {req.status === "accepted" && (
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/chat?user=${profile?.user_id}`)}>
                            <MessageCircle className="w-4 h-4 mr-1" /> Chat
                          </Button>
                        )}
                        <Badge variant={req.status === "accepted" ? "default" : "secondary"} className={req.status === "accepted" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                          {req.status === "accepted" ? "Accepted ✓" : "Declined"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && (!requests || requests.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground text-sm mb-6">When someone shows interest in your profile, you'll see it here</p>
            <Button variant="hero" asChild><Link to="/browse">Browse Profiles</Link></Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
