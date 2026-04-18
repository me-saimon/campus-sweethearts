import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, MapPin, GraduationCap, BookOpen, MessageCircle,
  Calendar, Sparkles, ChevronLeft, Send, Shield, ShieldX, User,
  Home, Scroll, BookHeart, Stethoscope, CheckCircle, Briefcase,
  Users, Star, Phone, Building2, Languages, Ruler, Palette
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

/* ---------- Atoms ---------- */

const DataRow = ({ icon: Icon, label, value }: { icon?: any; label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2.5 text-foreground/70 min-w-[140px]">
        {Icon && <Icon className="w-4 h-4 text-primary/70 shrink-0" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-right max-w-[60%] leading-relaxed">{value}</span>
    </div>
  );
};

const QuoteAnswer = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="mt-4 first:mt-0 rounded-xl bg-muted/40 border border-border/60 p-5">
      <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-semibold mb-2">{label}</p>
      <p className="text-[15px] leading-[1.75] text-foreground/85">{value}</p>
    </div>
  );
};

const SectionCard = ({ id, icon: Icon, title, subtitle, children, delay = 0.1 }: { id?: string; icon: any; title: string; subtitle?: string; children: React.ReactNode; delay?: number }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    className="bg-card rounded-2xl border border-border/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
  >
    <header className="flex items-center gap-3 px-6 py-4 border-b border-border/60">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/15">
        <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={2.2} />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground tracking-tight leading-none">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </header>
    <div className="p-6">{children}</div>
  </motion.section>
);

const StatTile = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="bg-card rounded-xl border border-border/70 px-4 py-4 flex items-center gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
};

const TocLink = ({ href, label, active }: { href: string; label: string; active?: boolean }) => (
  <a
    href={href}
    className={`block text-sm py-2 px-3 rounded-md border-l-2 transition-colors ${
      active
        ? "border-primary text-primary bg-primary/5 font-semibold"
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`}
  >
    {label}
  </a>
);

/* ---------- Page ---------- */

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
          <h2 className="font-display text-2xl font-bold text-foreground">Profile not found</h2>
          <Button className="mt-4" asChild><Link to="/browse">Browse Profiles</Link></Button>
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

  const initials = canSeeFullDetails
    ? (profile.name || "A").charAt(0).toUpperCase() + (profile.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || "")
    : null;

  const tocItems = [
    { id: "about", label: "About" },
    { id: "academic", label: "Academic & Personal" },
    hasEdu && { id: "education", label: "Education History" },
    hasFamily && { id: "family", label: "Family Background" },
    hasRelViews && { id: "views", label: "Relationship Views" },
    hasPartnerPrefs && { id: "partner", label: "Partner Preferences" },
    hasHealth && { id: "health", label: "Health & Interests" },
    profile.interests?.length && { id: "hobbies", label: "Interests & Hobbies" },
    hasReligious && { id: "religion", label: "Religious Practice" },
    hasReligiousPrefs && { id: "religion-prefs", label: "Religious Preferences" },
    profile.looking_for && { id: "looking", label: "Looking For" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="min-h-screen bg-[hsl(40_30%_98%)]">
      <Navbar />

      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb / back */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to results
            </Button>
            <div className="flex items-center gap-2">
              {p?.verified ? (
                <Badge variant="outline" className="bg-primary/8 text-primary border-primary/25 text-xs px-2.5 py-1 font-medium">
                  <Shield className="w-3 h-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs px-2.5 py-1 font-medium">
                  <ShieldX className="w-3 h-3 mr-1" /> Unverified
                </Badge>
              )}
              <Badge variant="outline" className="bg-card text-muted-foreground border-border text-xs px-2.5 py-1 font-mono tracking-wide">
                {uniqueId}
              </Badge>
            </div>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] overflow-hidden mb-6"
          >
            {/* Soft cover with fade to card */}
            <div className="h-24 sm:h-28 relative overflow-hidden bg-gradient-to-br from-primary/80 via-primary/60 to-emerald-dark/50">
              <div className="absolute inset-0 islamic-pattern opacity-10" />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>

            <div className="px-6 sm:px-8 pb-6 pt-0">
              {/* Avatar + name row */}
              <div className="flex items-end gap-5 -mt-12 sm:-mt-14">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-card shadow-md shrink-0">
                  {canSeeFullDetails && profile.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                  <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/5 text-primary text-2xl font-display font-bold border border-primary/20">
                    {initials || <User className="w-9 h-9" />}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 pb-1.5">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <h1 className="font-display text-2xl sm:text-[28px] font-bold text-foreground tracking-tight leading-tight">
                      {canSeeFullDetails ? profile.name : uniqueId}
                    </h1>
                    {profile.age && <span className="text-lg text-muted-foreground font-medium">· {profile.age}</span>}
                  </div>
                </div>
              </div>

              {/* Meta row — its own line for breathing room */}
              <div className="flex items-center gap-x-5 gap-y-2 mt-4 text-[13px] text-muted-foreground flex-wrap">
                {profile.department && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-primary/70" />
                    {profile.department}{profile.year && ` · ${profile.year}`}
                  </span>
                )}
                {profile.university && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary/70" />
                    {profile.university}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary/70" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Action buttons — own row, right aligned with divider */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-border/60 justify-end">
                {!isOwnProfile && (
                  <>
                    {canChat ? (
                      <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/8 h-10" onClick={() => navigate(`/chat?user=${userId}`)}>
                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                      </Button>
                    ) : null}
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 shadow-sm" onClick={handleShowInterest} disabled={sendInterest.isPending || alreadySent}>
                      <Send className="w-4 h-4 mr-2" />
                      {alreadySent ? "Interest Sent" : "Send Interest"}
                    </Button>
                  </>
                )}
                {isOwnProfile && (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10" asChild>
                    <Link to="/profile/edit">Edit Profile</Link>
                  </Button>
                )}
              </div>

              {/* Verified banner */}
              {p?.verified && (
                <div className="mt-5 flex items-center gap-2 text-[13px] text-primary bg-primary/8 px-4 py-2.5 rounded-lg border border-primary/15">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span><strong>Verified student</strong> · {profile.university} · {profile.department}</span>
                </div>
              )}

              {/* Guardian (after acceptance) */}
              {canSeeFullDetails && guardianInfo.phone && !isOwnProfile && (
                <div className="mt-4 p-4 bg-secondary/8 rounded-xl border border-secondary/20 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">Guardian Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {guardianInfo.name && <span>{guardianInfo.name} ({guardianInfo.relation}) · </span>}
                      {guardianInfo.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* KPI strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          >
            <StatTile icon={Ruler} label="Height" value={p?.height} />
            <StatTile icon={Star} label="Religion" value={profile.religion} />
            <StatTile icon={GraduationCap} label="Year" value={profile.year} />
            <StatTile icon={Heart} label="Status" value={p?.marital_status} />
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-1 bg-card rounded-2xl border border-border/70 p-3 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold px-3 py-2">On this page</p>
                {tocItems.map((item) => (
                  <TocLink key={item.id} href={`#${item.id}`} label={item.label} />
                ))}

                {/* Profile strength */}
                <div className="mt-4 pt-4 border-t border-border/60 px-3 pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground font-medium">Profile Strength</span>
                    <span className="text-xs font-bold text-primary">{completeness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="space-y-5 min-w-0">
              {/* About */}
              <SectionCard id="about" icon={Sparkles} title="About" subtitle="Personal introduction" delay={0.05}>
                <p className="text-[15px] leading-[1.8] text-foreground/85">
                  {profile.bio || <span className="text-muted-foreground italic">No bio added yet.</span>}
                </p>
              </SectionCard>

              {/* Academic & Personal */}
              <SectionCard id="academic" icon={GraduationCap} title="Academic & Personal" subtitle="Background details" delay={0.08}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-bold mb-2">Academic</p>
                    <DataRow icon={Building2} label="University" value={profile.university} />
                    <DataRow icon={BookOpen} label="Department" value={profile.department} />
                    <DataRow icon={Calendar} label="Year" value={profile.year} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-bold mb-2 mt-6 md:mt-0">Personal</p>
                    <DataRow icon={Star} label="Religion" value={profile.religion} />
                    <DataRow icon={Palette} label="Skin Tone" value={p?.skin_tone} />
                    <DataRow icon={MapPin} label="Location" value={profile.location} />
                  </div>
                </div>
              </SectionCard>

              {/* Education History */}
              {hasEdu && (
                <SectionCard id="education" icon={BookOpen} title="Education History" subtitle="Academic timeline" delay={0.1}>
                  <div className="space-y-3">
                    {eduDetails.map((edu, i) => (
                      <div key={i} className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-l-transparent last:pb-0">
                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                          <p className="font-semibold text-foreground text-[15px]">{edu.level}</p>
                          {edu.year && <span className="text-xs text-muted-foreground font-medium bg-muted/60 px-2 py-0.5 rounded">{edu.year}</span>}
                        </div>
                        {edu.subject && <p className="text-sm text-foreground/75 mt-1">{edu.subject}</p>}
                        {edu.details && <p className="text-xs text-muted-foreground mt-1">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Family */}
              {hasFamily && (
                <SectionCard id="family" icon={Home} title="Family Background" subtitle="Parents & household" delay={0.12}>
                  {(family.fatherStatus || family.motherStatus) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-xl border border-border/70 p-4 bg-muted/20">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-bold mb-2">Father</p>
                        {family.fatherStatus && <p className="text-sm text-foreground"><span className="text-muted-foreground">Status:</span> <span className="font-medium">{family.fatherStatus}</span></p>}
                        {family.fatherOccupation && <p className="text-sm text-foreground mt-1"><span className="text-muted-foreground">Occupation:</span> <span className="font-medium">{family.fatherOccupation}</span></p>}
                      </div>
                      <div className="rounded-xl border border-border/70 p-4 bg-muted/20">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-bold mb-2">Mother</p>
                        {family.motherStatus && <p className="text-sm text-foreground"><span className="text-muted-foreground">Status:</span> <span className="font-medium">{family.motherStatus}</span></p>}
                        {family.motherOccupation && <p className="text-sm text-foreground mt-1"><span className="text-muted-foreground">Occupation:</span> <span className="font-medium">{family.motherOccupation}</span></p>}
                      </div>
                    </div>
                  )}
                  <DataRow icon={Users} label="Siblings" value={family.siblings} />
                  <DataRow icon={Heart} label="Family Values" value={family.familyValues} />
                  <DataRow icon={Briefcase} label="Economic Condition" value={family.economicCondition} />
                  <DataRow icon={Languages} label="Political View" value={family.politicalView} />
                </SectionCard>
              )}

              {/* Relationship views */}
              {hasRelViews && (
                <SectionCard id="views" icon={Heart} title="Relationship Views" subtitle="Personal philosophy" delay={0.14}>
                  <QuoteAnswer label="Premarital Relationships" value={relViews.premaritalView} />
                  <QuoteAnswer label="Respect, Dependence & Equality" value={relViews.respectEqualityView} />
                  <QuoteAnswer label="Male-Female Friendship View" value={relViews.maleFemaleView} />
                </SectionCard>
              )}

              {/* Partner preferences */}
              {hasPartnerPrefs && (
                <SectionCard id="partner" icon={BookHeart} title="Partner Preferences" subtitle="Looking for in a spouse" delay={0.16}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {partnerPrefs.ageRange && (
                      <div className="border border-border/70 rounded-xl p-3 text-center bg-muted/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Age</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.ageRange}</p>
                      </div>
                    )}
                    {partnerPrefs.heightRange && (
                      <div className="border border-border/70 rounded-xl p-3 text-center bg-muted/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Height</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.heightRange}</p>
                      </div>
                    )}
                    {partnerPrefs.skinTone && (
                      <div className="border border-border/70 rounded-xl p-3 text-center bg-muted/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Skin</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.skinTone}</p>
                      </div>
                    )}
                    {partnerPrefs.maritalStatus && (
                      <div className="border border-border/70 rounded-xl p-3 text-center bg-muted/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Status</p>
                        <p className="text-sm font-bold text-foreground">{partnerPrefs.maritalStatus}</p>
                      </div>
                    )}
                  </div>
                  <DataRow icon={GraduationCap} label="Education" value={partnerPrefs.educationPref} />
                  <DataRow icon={Briefcase} label="Profession" value={partnerPrefs.professionPref} />
                  <DataRow icon={BookOpen} label="Study After Marriage" value={partnerPrefs.studyAfterMarriage} />
                  <DataRow icon={Briefcase} label="Work After Marriage" value={partnerPrefs.workAfterMarriage} />
                  <DataRow icon={Star} label="Profession Expectation" value={partnerPrefs.professionExpectation} />
                </SectionCard>
              )}

              {/* Health */}
              {hasHealth && (
                <SectionCard id="health" icon={Stethoscope} title="Health & Goals" subtitle="Wellbeing and aspirations" delay={0.18}>
                  <DataRow icon={Stethoscope} label="Physical Illness" value={p?.physical_illness} />
                  <QuoteAnswer label="Personal Interests & Career Goals" value={health.personalInterestsGoals} />
                </SectionCard>
              )}

              {/* Hobbies */}
              {profile.interests && profile.interests.length > 0 && (
                <SectionCard id="hobbies" icon={Sparkles} title="Interests & Hobbies" delay={0.2}>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="bg-primary/8 text-primary border-primary/20 py-1.5 px-3 text-xs font-medium rounded-full">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Religious practice */}
              {hasReligious && (
                <SectionCard id="religion" icon={Scroll} title="Religious Practice" subtitle="Faith & devotion" delay={0.22}>
                  <DataRow icon={Star} label="Prayer Frequency" value={religious.prayerFrequency} />
                  <QuoteAnswer label="Religious Philosophy" value={religious.religiousPhilosophy} />
                </SectionCard>
              )}

              {/* Religious prefs */}
              {hasReligiousPrefs && (
                <SectionCard id="religion-prefs" icon={BookHeart} title="Religious Preferences" subtitle="Expectations of partner" delay={0.24}>
                  <QuoteAnswer label="Religious Expectations" value={religiousPrefs.religiousExpectations} />
                  <div className="mt-2">
                    <DataRow icon={Heart} label="Preferred Mahr" value={religiousPrefs.preferredMahr} />
                    <DataRow icon={Star} label="Specific Characteristics" value={religiousPrefs.specificCharacteristics} />
                    <DataRow icon={Sparkles} label="Other Preferences" value={religiousPrefs.otherPreferences} />
                  </div>
                </SectionCard>
              )}

              {/* Looking for */}
              {profile.looking_for && (
                <SectionCard id="looking" icon={BookOpen} title="Looking For" delay={0.26}>
                  <p className="text-[15px] leading-[1.8] text-foreground/85">{profile.looking_for}</p>
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
