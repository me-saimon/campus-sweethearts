import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, MapPin, GraduationCap, BookOpen, MessageCircle,
  Calendar, Star, Sparkles, ChevronLeft, Send, Shield, User, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProfileByUserId } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useSendInterest, useSentInterests, useCanChat } from "@/hooks/useInterestRequests";
import { toast } from "sonner";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileByUserId(userId);
  const sendInterest = useSendInterest();
  const { data: sentInterests } = useSentInterests();
  const { data: canChat } = useCanChat(userId);

  const alreadySent = sentInterests?.some((r) => r.to_user_id === userId);
  const isOwnProfile = user?.id === userId;

  const handleShowInterest = () => {
    if (!user) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }
    if (alreadySent) {
      toast.info("You've already shown interest.");
      return;
    }
    sendInterest.mutate(userId!, {
      onSuccess: () => toast.success("Interest shown! ৳500 fee applies."),
      onError: (err: any) => toast.error(err.message || "Failed to send interest."),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-display font-bold">Profile not found</h2>
          <Button variant="hero" className="mt-4" asChild>
            <Link to="/browse">Browse Profiles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Shield className="w-3 h-3 mr-1" /> Verified Profile
            </Badge>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-none overflow-hidden">
              <div className="h-36 bg-gradient-hero relative">
                <div className="absolute inset-0 islamic-pattern opacity-20" />
              </div>
              <CardContent className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                  <Avatar className="w-28 h-28 ring-4 ring-card shadow-lg">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                      {(profile.name || "A").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-display font-bold">{profile.name}</h1>
                      {profile.age && <span className="text-lg text-muted-foreground">{profile.age}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-3 mt-6">
                    {canChat ? (
                      <Button variant="outline" className="flex-1" onClick={() => navigate(`/chat?user=${userId}`)}>
                        <MessageCircle className="w-4 h-4 mr-2" /> Chat Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        <MessageCircle className="w-4 h-4 mr-2" /> Accept interest to chat
                      </Button>
                    )}
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={handleShowInterest}
                      disabled={sendInterest.isPending || alreadySent}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {alreadySent ? "Interest Sent ✓" : "Show Interest"}
                    </Button>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="flex gap-3 mt-6">
                    <Button variant="hero" className="flex-1" asChild>
                      <Link to="/profile/edit">Edit Profile</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> About
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio || "No bio yet."}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-secondary" /> Academic Details
                  </h3>
                  <div className="space-y-3">
                    {profile.university && <div className="flex justify-between"><span className="text-muted-foreground">University</span><span className="font-medium">{profile.university}</span></div>}
                    {profile.department && <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{profile.department}</span></div>}
                    {profile.year && <div className="flex justify-between"><span className="text-muted-foreground">Year</span><span className="font-medium">{profile.year}</span></div>}
                    {profile.religion && <div className="flex justify-between"><span className="text-muted-foreground">Religion</span><span className="font-medium">{profile.religion}</span></div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {profile.interests && profile.interests.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="shadow-card border-none h-full">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" /> Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="bg-primary/10 text-primary py-1.5 px-3">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {profile.looking_for && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card className="shadow-card border-none h-full">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-lavender" /> Looking For
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.looking_for}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
