import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, MapPin, GraduationCap, BookOpen, MessageCircle,
  Calendar, Sparkles, ChevronLeft, Send, Shield, ShieldX, User,
  Home, Scroll, BookHeart, Stethoscope, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex justify-between py-3 border-b border-border last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, delay = 0.2 }: { icon: any; title: string; children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-secondary" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </motion.div>
);

const StatBox = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="flex-1 text-center py-4 px-3 border border-border rounded-lg bg-muted/30">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">{label}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
};

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
      await supabase.from("profiles").update({ interest_credits: credits - 1 } as any).eq("user_id", user.id);
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
      <div className="min-h-screen bg-background dark"><Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background dark"><Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Profile not found</h2>
          <Button variant="hero" className="mt-4" asChild><Link to="/browse">Browse Profiles</Link></Button>
        </div>
      </div>
    );
  }

  const family = p?.family_background || {};
  const eduDetails: Array<{ level: string; subject: string; details: string; year: string }> = p?.education_details || [];
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

  // Profile completeness
  const totalFields = 12;
  let filledFields = 0;
  if (profile.bio) filledFields++;
  if (profile.university) filledFields++;
  if (profile.department) filledFields++;
  if (profile.location) filledFields++;
  if (profile.interests?.length) filledFields++;
  if (p?.height) filledFields++;
  if (p?.marital_status) filledFields++;
  if (hasFamily) filledFields++;
  if (hasEdu) filledFields++;
  if (hasReligious) filledFields++;
  if (hasPartnerPrefs) filledFields++;
  if (profile.looking_for) filledFields++;
  const completeness = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back + Verified */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {p?.verified ? (
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                <Shield className="w-3 h-3 mr-1" /> Verified Profile
              </Badge>
            ) : (
              <Badge className="bg-muted text-muted-foreground border border-border">
                <ShieldX className="w-3 h-3 mr-1" /> Unverified
              </Badge>
            )}
          </motion.div>

          {/* Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Gold gradient header */}
              <div className="h-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(30 20% 15%), hsl(42 60% 30%), hsl(30 15% 12%))" }}>
                <div className="absolute inset-0 islamic-pattern opacity-30" />
              </div>
              <div className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                  <Avatar className="w-24 h-24 ring-4 ring-secondary/50 shadow-lg">
                    {canSeeFullDetails && profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-card text-secondary text-2xl font-display border-2 border-secondary/30">
                      {canSeeFullDetails ? (profile.name || "A").charAt(0).toUpperCase() + (profile.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || "") : <User className="w-8 h-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-display font-bold text-foreground">
                        {canSeeFullDetails ? profile.name : uniqueId}
                      </h1>
                      {profile.age && <span className="text-lg text-muted-foreground">{profile.age}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                      {p?.marital_status && <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {p.marital_status}</span>}
                      {profile.department && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {profile.department} · {profile.year}</span>}
                    </div>
                  </div>
                </div>

                {/* Verified bar */}
                {p?.verified && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Profile verified · {profile.university} · {profile.department}</span>
                  </div>
                )}

                {/* Action buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-3 mt-5">
                    {canChat ? (
                      <Button variant="outline" className="flex-1 border-secondary/40 text-secondary hover:bg-secondary/10" onClick={() => navigate(`/chat?user=${userId}`)}>
                        <MessageCircle className="w-4 h-4 mr-2" /> Chat Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 border-border text-muted-foreground" disabled>
                        <MessageCircle className="w-4 h-4 mr-2" /> Accept interest to chat
                      </Button>
                    )}
                    <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleShowInterest} disabled={sendInterest.isPending || alreadySent}>
                      <Send className="w-4 h-4 mr-2" />{alreadySent ? "Interest Sent ✓" : "Send Interest"}
                    </Button>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="flex gap-3 mt-5">
                    <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                      <Link to="/profile/edit">Edit Profile</Link>
                    </Button>
                  </div>
                )}

                {/* Guardian info */}
                {canSeeFullDetails && guardianInfo.phone && !isOwnProfile && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-1">Guardian Contact (visible after acceptance)</p>
                    <p className="text-sm text-muted-foreground">
                      {guardianInfo.name && <span>{guardianInfo.name} ({guardianInfo.relation}) · </span>}
                      {guardianInfo.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6">
            <div className="flex gap-3">
              <StatBox label="Height" value={p?.height} />
              <StatBox label="Religion" value={profile.religion} />
              <StatBox label="Study Year" value={profile.year} />
              <StatBox label="Skin Tone" value={p?.skin_tone} />
            </div>
          </motion.div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* About */}
              <SectionCard icon={Sparkles} title="About" delay={0.2}>
                <p className="text-muted-foreground leading-relaxed text-sm italic border-l-2 border-secondary/30 pl-4">
                  {profile.bio || "No bio yet."}
                </p>
              </SectionCard>

              {/* Academic Details */}
              <SectionCard icon={GraduationCap} title="Academic Details" delay={0.25}>
                <div className="space-y-0">
                  <TableRow label="University" value={profile.university} />
                  <TableRow label="Department" value={profile.department} />
                  <TableRow label="Year" value={profile.year} />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold text-center mb-3">— Personal —</p>
                  <div className="space-y-0">
                    <TableRow label="Religion" value={profile.religion} />
                    <TableRow label="Skin Tone" value={p?.skin_tone} />
                    <TableRow label="Location" value={profile.location} />
                  </div>
                </div>
              </SectionCard>

              {hasEdu && (
                <SectionCard icon={BookOpen} title="Education & Profession" delay={0.28}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-secondary/20">
                          <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Level</th>
                          <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Subject</th>
                          <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Details</th>
                          <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eduDetails.map((edu, i) => (
                          <tr key={i} className="border-b border-border">
                            <td className="py-2.5 font-medium text-foreground">{edu.level}</td>
                            <td className="py-2.5 text-muted-foreground">{edu.subject}</td>
                            <td className="py-2.5 text-muted-foreground">{edu.details}</td>
                            <td className="py-2.5 text-muted-foreground">{edu.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              )}

              {hasFamily && (
                <SectionCard icon={Home} title="Family Background" delay={0.3}>
                  {(family.fatherStatus || family.motherStatus) && (
                    <>
                      <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">Parents</p>
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-secondary/20">
                              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Detail</th>
                              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Father</th>
                              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-secondary font-semibold">Mother</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border"><td className="py-2.5 font-medium text-foreground">Status</td><td className="text-muted-foreground">{family.fatherStatus || "-"}</td><td className="text-muted-foreground">{family.motherStatus || "-"}</td></tr>
                            <tr className="border-b border-border"><td className="py-2.5 font-medium text-foreground">Occupation</td><td className="text-muted-foreground">{family.fatherOccupation || "-"}</td><td className="text-muted-foreground">{family.motherOccupation || "-"}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  <div className="space-y-0">
                    <TableRow label="Siblings" value={family.siblings} />
                    <TableRow label="Family Values" value={family.familyValues} />
                    <TableRow label="Economic Condition" value={family.economicCondition} />
                    <TableRow label="Political View" value={family.politicalView} />
                  </div>
                </SectionCard>
              )}

              {hasRelViews && (
                <SectionCard icon={Heart} title="Relationship Views" delay={0.35}>
                  <div className="space-y-4">
                    {relViews.premaritalView && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Premarital Relationships</p>
                        <p className="text-muted-foreground text-sm">{relViews.premaritalView}</p>
                      </div>
                    )}
                    {relViews.respectEqualityView && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Respect, Dependence & Equality</p>
                        <p className="text-muted-foreground text-sm">{relViews.respectEqualityView}</p>
                      </div>
                    )}
                    {relViews.maleFemaleView && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Male-Female Friendship View</p>
                        <p className="text-muted-foreground text-sm">{relViews.maleFemaleView}</p>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {hasPartnerPrefs && (
                <SectionCard icon={BookHeart} title="Partner Preferences" delay={0.2}>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold text-center mb-3">— Basic —</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {partnerPrefs.ageRange && (
                      <div className="border border-border rounded-lg p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Age Range</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.ageRange}</p>
                      </div>
                    )}
                    {partnerPrefs.heightRange && (
                      <div className="border border-border rounded-lg p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Height</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.heightRange}</p>
                      </div>
                    )}
                    {partnerPrefs.skinTone && (
                      <div className="border border-border rounded-lg p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Skin Tone</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.skinTone}</p>
                      </div>
                    )}
                    {partnerPrefs.maritalStatus && (
                      <div className="border border-border rounded-lg p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Marital Status</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.maritalStatus}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold text-center mb-3">— Education —</p>
                  <div className="space-y-0 mb-4">
                    <TableRow label="Education" value={partnerPrefs.educationPref} />
                    <TableRow label="Profession" value={partnerPrefs.professionPref} />
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold text-center mb-3">— Post-Marriage —</p>
                  <div className="space-y-0">
                    <TableRow label="Study After Marriage" value={partnerPrefs.studyAfterMarriage} />
                    <TableRow label="Work After Marriage" value={partnerPrefs.workAfterMarriage} />
                    <TableRow label="Profession Expectation" value={partnerPrefs.professionExpectation} />
                  </div>
                </SectionCard>
              )}

              {hasHealth && (
                <SectionCard icon={Stethoscope} title="Health & Interests" delay={0.28}>
                  <div className="space-y-0"><TableRow label="Physical Illness" value={p?.physical_illness} /></div>
                  {health.personalInterestsGoals && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Personal Interests & Career Goals</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{health.personalInterestsGoals}</p>
                    </div>
                  )}
                </SectionCard>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <SectionCard icon={Sparkles} title="Interests & Hobbies" delay={0.3}>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} className="bg-secondary/15 text-secondary border border-secondary/25 py-1.5 px-3 text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>
              )}

              {hasReligious && (
                <SectionCard icon={Scroll} title="Religious Practice" delay={0.32}>
                  <div className="space-y-0"><TableRow label="Prayer Frequency" value={religious.prayerFrequency} /></div>
                  {religious.religiousPhilosophy && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Religious Philosophy</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{religious.religiousPhilosophy}</p>
                    </div>
                  )}
                </SectionCard>
              )}

              {hasReligiousPrefs && (
                <SectionCard icon={BookHeart} title="Religious Preferences" delay={0.35}>
                  {religiousPrefs.religiousExpectations && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Religious Expectations</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{religiousPrefs.religiousExpectations}</p>
                    </div>
                  )}
                  <div className="space-y-0">
                    <TableRow label="Preferred Mahr" value={religiousPrefs.preferredMahr} />
                    <TableRow label="Specific Characteristics" value={religiousPrefs.specificCharacteristics} />
                    <TableRow label="Other Preferences" value={religiousPrefs.otherPreferences} />
                  </div>
                </SectionCard>
              )}

              {/* Profile Strength */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">Profile Strength</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Completeness</span>
                      <span className="text-lg font-bold text-primary">{completeness}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completeness}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-full bg-secondary rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-primary" /> Basic info complete
                    </p>
                  </div>
                </div>
              </motion.div>

              {profile.looking_for && (
                <SectionCard icon={BookOpen} title="Looking For" delay={0.4}>
                  <p className="text-muted-foreground leading-relaxed text-sm">{profile.looking_for}</p>
                </SectionCard>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
