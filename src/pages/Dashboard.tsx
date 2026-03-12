import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import {
  Heart, MessageCircle, Eye, Users, Bell, Settings,
  ChevronRight, Sparkles, Clock, CheckCircle, XCircle,
  Star, ShoppingCart, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useProfile";
import { useReceivedInterests, useSentInterests } from "@/hooks/useInterestRequests";
import { useChatContacts } from "@/hooks/useMessages";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: receivedInterests } = useReceivedInterests();
  const { data: sentInterests } = useSentInterests();
  const { data: chatContacts } = useChatContacts();

  if (!loading && !user) return <Navigate to="/login" />;

  const pendingCount = receivedInterests?.filter((r) => r.status === "pending").length || 0;
  const acceptedCount = receivedInterests?.filter((r) => r.status === "accepted").length || 0;
  const activeChats = chatContacts?.length || 0;
  const profileName = profile?.name || user?.email?.split("@")[0] || "User";

  // Calculate profile completion
  const fields = [profile?.name, profile?.age, profile?.university, profile?.department, profile?.year, profile?.bio, profile?.location, profile?.avatar_url];
  const filled = fields.filter(Boolean).length;
  const completionPct = Math.round((filled / fields.length) * 100);

  const pendingActions = [];
  if (!profile?.avatar_url) pendingActions.push("Upload a profile photo");
  if (!profile?.university) pendingActions.push("Add your university");
  if (!profile?.bio) pendingActions.push("Write your bio");
  if (pendingCount > 0) pendingActions.push(`Respond to ${pendingCount} interest request(s)`);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />
        <div className="absolute inset-0 h-72 overflow-hidden">
          <div className="absolute top-6 left-12 text-secondary/30 text-3xl">☪</div>
          <div className="absolute top-10 right-16 text-secondary/20 text-2xl">☪</div>
        </div>

      <div className="relative">
        <div className="absolute inset-0 islamic-arabesque opacity-40 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-secondary/30">
                  {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xl font-display">
                    {profileName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground drop-shadow-md">
                    Welcome, <span className="text-secondary drop-shadow-sm">{profileName}</span> 👋
                  </h1>
                  <p className="text-primary-foreground/80 mt-1">Here's what's happening with your profile</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                  <Link to="/profile/edit"><Settings className="w-4 h-4 mr-1" /> Edit Profile</Link>
                </Button>
                <Button variant="outline" size="sm" className="bg-secondary/20 border-secondary/30 text-primary-foreground hover:bg-secondary/30" asChild>
                  <Link to="/purchase-connects"><ShoppingCart className="w-4 h-4 mr-1" /> Buy Connects ({(profile as any)?.interest_credits || 0})</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/browse"><Users className="w-4 h-4 mr-1" /> Browse</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Interests Received", value: String(receivedInterests?.length || 0), icon: Heart, color: "text-rose", bg: "bg-rose/10", trend: `${pendingCount} pending` },
              { label: "Interests Sent", value: String(sentInterests?.length || 0), icon: Sparkles, color: "text-accent", bg: "bg-accent/10", trend: "" },
              { label: "Active Chats", value: String(activeChats), icon: MessageCircle, color: "text-secondary", bg: "bg-secondary/10", trend: "" },
              { label: "Matches", value: String(acceptedCount), icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", trend: "" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 bg-card/90 backdrop-blur-sm border border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      {stat.trend && (
                        <Badge variant="secondary" className="text-xs font-medium bg-secondary/10 text-secondary">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Completion */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-card border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" /> Profile Strength
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{completionPct}% complete</span>
                      <span className="text-sm font-semibold text-primary">{completionPct >= 80 ? "Great" : completionPct >= 50 ? "Good" : "Needs work"}</span>
                    </div>
                    <Progress value={completionPct} className="h-3 bg-muted" />
                  </div>
                  <div className="space-y-3">
                    {pendingActions.slice(0, 4).map((action, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{action}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link to="/profile/edit">Complete Profile <ChevronRight className="w-4 h-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Chats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
              <Card className="shadow-card border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-secondary" /> Active Chats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chatContacts && chatContacts.length > 0 ? (
                    <div className="space-y-3">
                      {chatContacts.slice(0, 5).map((contact) => (
                        <Link
                          key={contact.userId}
                          to={`/chat?user=${contact.userId}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="w-10 h-10">
                            {contact.avatarUrl ? <AvatarImage src={contact.avatarUrl} /> : null}
                            <AvatarFallback className="bg-gradient-hero text-primary-foreground font-display">
                              {contact.initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{contact.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No active chats yet</p>
                      <Button variant="hero" size="sm" className="mt-3" asChild>
                        <Link to="/browse">Browse Profiles</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* View own profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
            <Card className="shadow-card border-none bg-gradient-to-r from-primary/5 via-rose/5 to-lavender/5">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold">View Your Public Profile</h3>
                  <p className="text-sm text-muted-foreground">See how others view your profile</p>
                </div>
                <Button variant="hero" asChild>
                  <Link to={`/profile/${user?.id}`}><Eye className="w-4 h-4 mr-2" /> View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
