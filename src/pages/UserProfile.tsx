import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, MapPin, GraduationCap, BookOpen, MessageCircle,
  Calendar, Sparkles, ChevronLeft, Send, Shield, ShieldX, User,
  Home, Scroll, BookHeart, Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProfileByUserId } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useProfile";
import { useSendInterest, useSentInterests, useCanChat } from "@/hooks/useInterestRequests";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const generateUniqueId = (id: string) => {
  const hash = id.replace(/-/g, "").slice(0, 7).toUpperCase();
  return `UM-${hash}`;
};

const TableRow = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-muted/50 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm text-right max-w-[60%]">{value}</span>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, color, children, delay = 0.2 }: { icon: any; title: string; color: string; children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card className="shadow-card border-none">
      <CardContent className="p-6">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} /> {title}
        </h3>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileByUserId(userId);
  const { data: myProfile } = useMyProfile();
  const sendInterest = useSendInterest();
  const { data: sentInterests } = useSentInterests();
  const { data: canChat } = useCanChat(userId);

  const alreadySent = sentInterests?.some((r) => r.to_user_id === userId);
  const isOwnProfile = user?.id === userId;

  const p = profile as any;
  const uniqueId = userId ? generateUniqueId(userId) : "UM-0000000";

  // Determine if current user can see full details (name, photo, contact)
  const canSeeFullDetails = isOwnProfile || canChat;

  const handleShowInterest = async () => {
    if (!user) { toast.error("Please log in first."); navigate("/login"); return; }
    if (alreadySent) { toast.info("You've already shown interest."); return; }
    
    const credits = (myProfile as any)?.interest_credits || 0;
    if (credits <= 0) {
      toast.error("You need credits to show interest.", { description: "Purchase connects first." });
      navigate("/purchase-connects");
      return;
    }

    try {
      // Deduct one credit
      await supabase.from("profiles").update({ interest_credits: credits - 1 } as any).eq("user_id", user.id);
      // Send interest
      sendInterest.mutate(userId!, {
        onSuccess: () => toast.success("Interest sent! 💕"),
        onError: (err: any) => toast.error(err.message),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-display font-bold">Profile not found</h2>
          <Button variant="hero" className="mt-4" asChild><Link to="/browse">Browse Profiles</Link></Button>
        </div>
      </div>
    );
  }

  const family = p?.family_background || {};
  const eduDetails: Array<{level: string; subject: string; details: string; year: string}> = p?.education_details || [];
  const health = p?.health_interests || {};
  const religious = p?.religious_practice || {};
  const partnerPrefs = p?.partner_preferences || {};
  const religiousPrefs = p?.religious_preferences || {};
  const relViews = p?.relationship_views || {};
  const guardianInfo = p?.guardian_info || {};

  const hasFamily = family.fatherStatus || family.motherStatus || family.familyValues;
  const hasEdu = eduDetails.length > 0;
  const hasHealth = p?.physical_illness || health.personalInterestsGoals;
  const hasReligious = religious.prayerFrequency || religious.religiousPhilosophy;
  const hasPartnerPrefs = partnerPrefs.ageRange || partnerPrefs.educationPref || partnerPrefs.professionPref;
  const hasReligiousPrefs = religiousPrefs.religiousExpectations;
  const hasRelViews = relViews.premaritalView || relViews.respectEqualityView || relViews.maleFemaleView;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            {p?.verified ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary"><Shield className="w-3 h-3 mr-1" /> Verified Profile</Badge>
            ) : (
              <Badge variant="secondary" className="bg-muted text-muted-foreground"><ShieldX className="w-3 h-3 mr-1" /> Unverified</Badge>
            )}
          </motion.div>

          {/* Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-none overflow-hidden">
              <div className="h-36 bg-gradient-hero relative"><div className="absolute inset-0 islamic-pattern opacity-20" /></div>
              <CardContent className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                  <Avatar className="w-28 h-28 ring-4 ring-card shadow-lg">
                    {canSeeFullDetails && profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                      {canSeeFullDetails ? (profile.name || "A").charAt(0) : <User className="w-10 h-10" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-display font-bold">
                        {canSeeFullDetails ? profile.name : uniqueId}
                      </h1>
                      {profile.age && <span className="text-lg text-muted-foreground">{profile.age}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                      {p?.height && <span>{p.height}</span>}
                      {p?.marital_status && <span>{p.marital_status}</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-3 mt-6">
                    {canChat ? (
                      <Button variant="outline" className="flex-1" onClick={() => navigate(`/chat?user=${userId}`)}><MessageCircle className="w-4 h-4 mr-2" /> Chat Now</Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled><MessageCircle className="w-4 h-4 mr-2" /> Accept interest to chat</Button>
                    )}
                    <Button variant="hero" className="flex-1" onClick={handleShowInterest} disabled={sendInterest.isPending || alreadySent}>
                      <Send className="w-4 h-4 mr-2" />{alreadySent ? "Interest Sent ✓" : "Show Interest"}
                    </Button>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="flex gap-3 mt-6">
                    <Button variant="hero" className="flex-1" asChild><Link to="/profile/edit">Edit Profile</Link></Button>
                  </div>
                )}

                {/* Guardian/Contact info - only visible after mutual interest */}
                {canSeeFullDetails && guardianInfo.phone && !isOwnProfile && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1">Guardian Contact (visible after acceptance)</p>
                    <p className="text-sm text-muted-foreground">
                      {guardianInfo.name && <span>{guardianInfo.name} ({guardianInfo.relation}) · </span>}
                      {guardianInfo.phone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6 mt-6">
            {/* About */}
            <SectionCard icon={Sparkles} title="About" color="text-accent" delay={0.15}>
              <p className="text-muted-foreground leading-relaxed">{profile.bio || "No bio yet."}</p>
            </SectionCard>

            {/* Academic */}
            <SectionCard icon={GraduationCap} title="Academic Details" color="text-secondary" delay={0.2}>
              <div className="space-y-1">
                <TableRow label="University" value={profile.university} />
                <TableRow label="Department" value={profile.department} />
                <TableRow label="Year" value={profile.year} />
                <TableRow label="Religion" value={profile.religion} />
                <TableRow label="Skin Tone" value={p?.skin_tone} />
              </div>
            </SectionCard>

            {hasEdu && (
              <SectionCard icon={BookOpen} title="Education & Profession" color="text-primary" delay={0.22}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-primary/20">
                      <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Level</th>
                      <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Subject</th>
                      <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Details</th>
                      <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Year</th>
                    </tr></thead>
                    <tbody>
                      {eduDetails.map((edu, i) => (
                        <tr key={i} className="border-b border-muted/50">
                          <td className="py-2.5 font-medium">{edu.level}</td>
                          <td className="py-2.5">{edu.subject}</td>
                          <td className="py-2.5">{edu.details}</td>
                          <td className="py-2.5">{edu.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {hasFamily && (
              <SectionCard icon={Home} title="Family Background" color="text-accent" delay={0.25}>
                {(family.fatherStatus || family.motherStatus) && (
                  <>
                    <p className="text-sm font-medium mb-2">Parents</p>
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-primary/20">
                          <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Detail</th>
                          <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Father</th>
                          <th className="text-left py-2 text-xs uppercase text-primary font-semibold">Mother</th>
                        </tr></thead>
                        <tbody>
                          <tr className="border-b border-muted/50"><td className="py-2.5 font-medium">Status</td><td>{family.fatherStatus || "-"}</td><td>{family.motherStatus || "-"}</td></tr>
                          <tr className="border-b border-muted/50"><td className="py-2.5 font-medium">Occupation</td><td>{family.fatherOccupation || "-"}</td><td>{family.motherOccupation || "-"}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <TableRow label="Siblings" value={family.siblings} />
                  <TableRow label="Family Values" value={family.familyValues} />
                  <TableRow label="Economic Condition" value={family.economicCondition} />
                  <TableRow label="Political View" value={family.politicalView} />
                </div>
              </SectionCard>
            )}

            {hasHealth && (
              <SectionCard icon={Stethoscope} title="Health & Interests" color="text-rose" delay={0.28}>
                <div className="space-y-1"><TableRow label="Physical Illness" value={p?.physical_illness} /></div>
                {health.personalInterestsGoals && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Personal Interests & Career Goals</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{health.personalInterestsGoals}</p>
                  </div>
                )}
              </SectionCard>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <SectionCard icon={Heart} title="Interests" color="text-primary" delay={0.3}>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-primary/10 text-primary py-1.5 px-3">{interest}</Badge>
                  ))}
                </div>
              </SectionCard>
            )}

            {hasReligious && (
              <SectionCard icon={Scroll} title="Religious Practice" color="text-primary" delay={0.32}>
                <div className="space-y-1"><TableRow label="Prayer Frequency" value={religious.prayerFrequency} /></div>
                {religious.religiousPhilosophy && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Religious Philosophy</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{religious.religiousPhilosophy}</p>
                  </div>
                )}
              </SectionCard>
            )}

            {hasPartnerPrefs && (
              <SectionCard icon={Heart} title="Partner Preferences" color="text-rose" delay={0.35}>
                <p className="text-sm font-medium mb-2">Basic Preferences</p>
                <div className="space-y-1 mb-4">
                  <TableRow label="Age" value={partnerPrefs.ageRange} />
                  <TableRow label="Height" value={partnerPrefs.heightRange} />
                  <TableRow label="Skin Tone" value={partnerPrefs.skinTone} />
                  <TableRow label="Marital Status" value={partnerPrefs.maritalStatus} />
                </div>
                <p className="text-sm font-medium mb-2">Educational & Professional</p>
                <div className="space-y-1">
                  <TableRow label="Education" value={partnerPrefs.educationPref} />
                  <TableRow label="Profession" value={partnerPrefs.professionPref} />
                  <TableRow label="Study After Marriage" value={partnerPrefs.studyAfterMarriage} />
                  <TableRow label="Work After Marriage" value={partnerPrefs.workAfterMarriage} />
                  <TableRow label="Profession Expectation" value={partnerPrefs.professionExpectation} />
                </div>
              </SectionCard>
            )}

            {hasReligiousPrefs && (
              <SectionCard icon={BookHeart} title="Religious & Personal Preferences" color="text-secondary" delay={0.38}>
                {religiousPrefs.religiousExpectations && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Religious Expectations</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{religiousPrefs.religiousExpectations}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <TableRow label="Preferred Mahr Amount" value={religiousPrefs.preferredMahr} />
                  <TableRow label="Specific Characteristics" value={religiousPrefs.specificCharacteristics} />
                  <TableRow label="Other Preferences" value={religiousPrefs.otherPreferences} />
                </div>
              </SectionCard>
            )}

            {hasRelViews && (
              <SectionCard icon={Shield} title="Relationship Views" color="text-primary" delay={0.4}>
                <div className="space-y-4">
                  {relViews.premaritalView && <div><p className="text-sm font-medium mb-1">Premarital Relationships View</p><p className="text-muted-foreground text-sm">{relViews.premaritalView}</p></div>}
                  {relViews.respectEqualityView && <div><p className="text-sm font-medium mb-1">Respect, Dependence & Equality</p><p className="text-muted-foreground text-sm">{relViews.respectEqualityView}</p></div>}
                  {relViews.maleFemaleView && <div><p className="text-sm font-medium mb-1">Male-Female Friendship View</p><p className="text-muted-foreground text-sm">{relViews.maleFemaleView}</p></div>}
                </div>
              </SectionCard>
            )}

            {profile.looking_for && (
              <SectionCard icon={BookOpen} title="Looking For" color="text-secondary" delay={0.42}>
                <p className="text-muted-foreground leading-relaxed">{profile.looking_for}</p>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
