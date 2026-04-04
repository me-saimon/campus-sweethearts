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
    <div className="flex justify-between py-3.5 border-b border-border/60 last:border-b-0">
      <span className="text-lg" style={{ color: "#222" }}>{label}</span>
      <span className="font-semibold text-lg text-right max-w-[60%]" style={{ color: "#111" }}>{value}</span>
    </div>
  );
};

const OpenEndedAnswer = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-5">
      <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">{label}</p>
      <p className="text-lg leading-relaxed" style={{ color: "#333" }}>{value}</p>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, delay = 0.2 }: { icon: any; title: string; children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-7 py-5 border-b border-border bg-muted/30">
        <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: "#111" }}>{title}</h3>
      </div>
      <div className="p-7">{children}</div>
    </div>
  </motion.div>
);

const StatBox = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="flex-1 text-center py-5 px-4 border border-border rounded-xl bg-card shadow-sm">
      <p className="text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: "#555" }}>{label}</p>
      <p className="text-xl font-bold" style={{ color: "#111" }}>{value}</p>
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
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Georgia', serif" }}>Profile not found</h2>
          <Button className="mt-4 bg-primary text-primary-foreground" asChild><Link to="/browse">Browse Profiles</Link></Button>
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
    <div className="min-h-screen" style={{ background: "hsl(150 20% 95%)" }}>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back + Verified */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {p?.verified ? (
              <Badge className="bg-primary/15 text-primary border border-primary/30 text-sm px-3 py-1">
                <Shield className="w-3.5 h-3.5 mr-1" /> Verified Profile
              </Badge>
            ) : (
              <Badge className="bg-muted text-muted-foreground border border-border text-sm px-3 py-1">
                <ShieldX className="w-3.5 h-3.5 mr-1" /> Unverified
              </Badge>
            )}
          </motion.div>

          {/* All cards stacked vertically */}
          <div className="space-y-6">
            {/* Hero Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="h-36 relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  <div className="absolute inset-0 islamic-pattern opacity-20" />
                </div>
                <div className="relative px-7 pb-7">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
                    <Avatar className="w-28 h-28 ring-4 ring-primary/30 shadow-lg">
                      {canSeeFullDetails && profile.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} />
                      ) : null}
                      <AvatarFallback className="bg-card text-primary text-3xl border-2 border-primary/20" style={{ fontFamily: "'Georgia', serif" }}>
                        {canSeeFullDetails ? (profile.name || "A").charAt(0).toUpperCase() + (profile.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || "") : <User className="w-10 h-10" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                          {canSeeFullDetails ? profile.name : uniqueId}
                        </h1>
                        {profile.age && <span className="text-xl text-muted-foreground">{profile.age}</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                        {p?.marital_status && <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {p.marital_status}</span>}
                        {profile.department && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {profile.department} · {profile.year}</span>}
                      </div>
                    </div>
                  </div>

                  {p?.verified && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-primary bg-primary/10 px-5 py-3 rounded-xl border border-primary/15">
                      <CheckCircle className="w-4 h-4" />
                      <span>Profile verified · {profile.university} · {profile.department}</span>
                    </div>
                  )}

                  {!isOwnProfile && (
                    <div className="flex gap-3 mt-5">
                      {canChat ? (
                        <Button variant="outline" className="flex-1 border-primary/40 text-primary hover:bg-primary/10 h-12 text-base" onClick={() => navigate(`/chat?user=${userId}`)}>
                          <MessageCircle className="w-5 h-5 mr-2" /> Chat Now
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1 border-border text-muted-foreground h-12 text-base" disabled>
                          <MessageCircle className="w-5 h-5 mr-2" /> Accept interest to chat
                        </Button>
                      )}
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base" onClick={handleShowInterest} disabled={sendInterest.isPending || alreadySent}>
                        <Send className="w-5 h-5 mr-2" />{alreadySent ? "Interest Sent ✓" : "Send Interest"}
                      </Button>
                    </div>
                  )}
                  {isOwnProfile && (
                    <div className="flex gap-3 mt-5">
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base" asChild>
                        <Link to="/profile/edit">Edit Profile</Link>
                      </Button>
                    </div>
                  )}

                  {canSeeFullDetails && guardianInfo.phone && !isOwnProfile && (
                    <div className="mt-5 p-4 bg-primary/8 rounded-xl border border-primary/15">
                      <p className="text-sm font-semibold text-primary mb-1">Guardian Contact (visible after acceptance)</p>
                      <p className="text-base text-muted-foreground">
                        {guardianInfo.name && <span>{guardianInfo.name} ({guardianInfo.relation}) · </span>}
                        {guardianInfo.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label="Height" value={p?.height} />
                <StatBox label="Religion" value={profile.religion} />
                <StatBox label="Study Year" value={profile.year} />
                <StatBox label="Skin Tone" value={p?.skin_tone} />
              </div>
            </motion.div>

            {/* About */}
            <SectionCard icon={Sparkles} title="About" delay={0.2}>
              <p className="text-muted-foreground leading-relaxed text-base italic border-l-3 border-primary/30 pl-5">
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
              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center mb-3">— Personal —</p>
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
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Level</th>
                        <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Subject</th>
                        <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Details</th>
                        <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eduDetails.map((edu, i) => (
                        <tr key={i} className="border-b border-border/60">
                          <td className="py-3 font-medium text-foreground">{edu.level}</td>
                          <td className="py-3 text-muted-foreground">{edu.subject}</td>
                          <td className="py-3 text-muted-foreground">{edu.details}</td>
                          <td className="py-3 text-muted-foreground">{edu.year}</td>
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
                    <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Parents</p>
                    <div className="overflow-x-auto mb-5">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="border-b border-primary/20">
                            <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Detail</th>
                            <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Father</th>
                            <th className="text-left py-2.5 text-xs uppercase tracking-wider text-primary font-semibold">Mother</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/60"><td className="py-3 font-medium text-foreground">Status</td><td className="text-muted-foreground">{family.fatherStatus || "-"}</td><td className="text-muted-foreground">{family.motherStatus || "-"}</td></tr>
                          <tr className="border-b border-border/60"><td className="py-3 font-medium text-foreground">Occupation</td><td className="text-muted-foreground">{family.fatherOccupation || "-"}</td><td className="text-muted-foreground">{family.motherOccupation || "-"}</td></tr>
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
              <SectionCard icon={Heart} title="Relationship Views" delay={0.32}>
                <OpenEndedAnswer label="Premarital Relationships" value={relViews.premaritalView} />
                <OpenEndedAnswer label="Respect, Dependence & Equality" value={relViews.respectEqualityView} />
                <OpenEndedAnswer label="Male-Female Friendship View" value={relViews.maleFemaleView} />
              </SectionCard>
            )}

            {hasPartnerPrefs && (
              <SectionCard icon={BookHeart} title="Partner Preferences" delay={0.34}>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center mb-4">— Basic —</p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {partnerPrefs.ageRange && (
                    <div className="border border-border rounded-xl p-4 text-center bg-muted/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Age Range</p>
                      <p className="text-base font-bold text-foreground">{partnerPrefs.ageRange}</p>
                    </div>
                  )}
                  {partnerPrefs.heightRange && (
                    <div className="border border-border rounded-xl p-4 text-center bg-muted/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Height</p>
                      <p className="text-base font-bold text-foreground">{partnerPrefs.heightRange}</p>
                    </div>
                  )}
                  {partnerPrefs.skinTone && (
                    <div className="border border-border rounded-xl p-4 text-center bg-muted/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Skin Tone</p>
                      <p className="text-base font-bold text-foreground">{partnerPrefs.skinTone}</p>
                    </div>
                  )}
                  {partnerPrefs.maritalStatus && (
                    <div className="border border-border rounded-xl p-4 text-center bg-muted/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Marital Status</p>
                      <p className="text-base font-bold text-foreground">{partnerPrefs.maritalStatus}</p>
                    </div>
                  )}
                </div>

                <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center mb-4">— Education —</p>
                <div className="space-y-0 mb-5">
                  <TableRow label="Education" value={partnerPrefs.educationPref} />
                  <TableRow label="Profession" value={partnerPrefs.professionPref} />
                </div>

                <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center mb-4">— Post-Marriage —</p>
                <div className="space-y-0">
                  <TableRow label="Study After Marriage" value={partnerPrefs.studyAfterMarriage} />
                  <TableRow label="Work After Marriage" value={partnerPrefs.workAfterMarriage} />
                  <TableRow label="Profession Expectation" value={partnerPrefs.professionExpectation} />
                </div>
              </SectionCard>
            )}

            {hasHealth && (
              <SectionCard icon={Stethoscope} title="Health & Interests" delay={0.36}>
                <div className="space-y-0"><TableRow label="Physical Illness" value={p?.physical_illness} /></div>
                <OpenEndedAnswer label="Personal Interests & Career Goals" value={health.personalInterestsGoals} />
              </SectionCard>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <SectionCard icon={Sparkles} title="Interests & Hobbies" delay={0.38}>
                <div className="flex flex-wrap gap-2.5">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} className="bg-primary/10 text-primary border border-primary/20 py-2 px-4 text-sm">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </SectionCard>
            )}

            {hasReligious && (
              <SectionCard icon={Scroll} title="Religious Practice" delay={0.4}>
                <div className="space-y-0"><TableRow label="Prayer Frequency" value={religious.prayerFrequency} /></div>
                <OpenEndedAnswer label="Religious Philosophy" value={religious.religiousPhilosophy} />
              </SectionCard>
            )}

            {hasReligiousPrefs && (
              <SectionCard icon={BookHeart} title="Religious Preferences" delay={0.42}>
                <OpenEndedAnswer label="Religious Expectations" value={religiousPrefs.religiousExpectations} />
                <div className="space-y-0 mt-4">
                  <TableRow label="Preferred Mahr" value={religiousPrefs.preferredMahr} />
                  <TableRow label="Specific Characteristics" value={religiousPrefs.specificCharacteristics} />
                  <TableRow label="Other Preferences" value={religiousPrefs.otherPreferences} />
                </div>
              </SectionCard>
            )}

            {/* Profile Strength */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-7 py-5 border-b border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Profile Strength</h3>
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base text-muted-foreground">Completeness</span>
                    <span className="text-xl font-bold text-primary">{completeness}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" /> Basic info complete
                  </p>
                </div>
              </div>
            </motion.div>

            {profile.looking_for && (
              <SectionCard icon={BookOpen} title="Looking For" delay={0.46}>
                <p className="text-muted-foreground leading-relaxed text-base">{profile.looking_for}</p>
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
