import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, GraduationCap, MessageSquarePlus, ChevronDown, ChevronUp, Quote, ThumbsUp, CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CrescentStar } from "@/components/IslamicVectors";
import { toast } from "sonner";
import type { Endorsement } from "@/data/mockProfiles";

interface EndorsementSectionProps {
  endorsements: Endorsement[];
  profileName: string;
  profileUniversity: string;
  profileDepartment: string;
  profileYear: string;
}

type EligibilityMatch = {
  eligible: boolean;
  relationship: Endorsement["relationship"] | null;
  matchDetails: string[];
};

const getEligibility = (
  university: string,
  department: string,
  year: string,
  profileUniversity: string,
  profileDepartment: string,
  profileYear: string
): EligibilityMatch => {
  const uniMatch = university.trim().toLowerCase() === profileUniversity.toLowerCase();
  const deptMatch = department.trim().toLowerCase() === profileDepartment.toLowerCase();
  const yearMatch = year.trim().toLowerCase() === profileYear.toLowerCase();

  if (!uniMatch) return { eligible: false, relationship: null, matchDetails: ["University doesn't match"] };

  const matches: string[] = [];
  let relationship: Endorsement["relationship"] = "university_peer";

  if (uniMatch) matches.push("Same university");
  if (deptMatch && yearMatch) {
    relationship = "classmate";
    matches.push("Same department", "Same batch");
  } else if (yearMatch) {
    relationship = "batchmate";
    matches.push("Same batch");
  } else if (deptMatch) {
    relationship = "department_peer";
    matches.push("Same department");
  }

  return { eligible: true, relationship, matchDetails: matches };
};

const relationshipLabels: Record<Endorsement["relationship"], string> = {
  classmate: "Classmate",
  batchmate: "Batchmate",
  department_peer: "Same Dept",
  university_peer: "Same Uni",
};

const relationshipColors: Record<Endorsement["relationship"], string> = {
  classmate: "bg-primary/10 text-primary border-primary/15",
  batchmate: "bg-accent/10 text-accent border-accent/15",
  department_peer: "bg-teal/10 text-teal border-teal/15",
  university_peer: "bg-rose/10 text-rose border-rose/15",
};

const StarRating = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`transition-colors ${star <= rating ? "text-accent fill-accent" : "text-muted-foreground/20"}`}
        style={{ width: size, height: size }}
      />
    ))}
  </div>
);

const InteractiveStarRating = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(star)}
          className="p-0.5 transition-transform hover:scale-125"
        >
          <Star
            className={`w-5 h-5 transition-colors ${star <= (hovered || rating) ? "text-accent fill-accent" : "text-muted-foreground/25"}`}
          />
        </button>
      ))}
    </div>
  );
};

const EndorsementSection = ({ endorsements, profileName, profileUniversity, profileDepartment, profileYear }: EndorsementSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({ name: "", university: "", department: "", year: "", comment: "", rating: 0 });

  const eligibility = getEligibility(formData.university, formData.department, formData.year, profileUniversity, profileDepartment, profileYear);

  const avgRating = endorsements.length > 0
    ? (endorsements.reduce((sum, e) => sum + e.rating, 0) / endorsements.length).toFixed(1)
    : "0";

  const displayed = showAll ? endorsements : endorsements.slice(0, 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.university || !formData.comment || formData.rating === 0) {
      toast.error("Please fill in all required fields and give a rating.");
      return;
    }
    if (!eligibility.eligible) {
      toast.error("You must be from the same university to endorse this profile.");
      return;
    }
    toast.success("JazakAllahu Khairan! Your endorsement has been submitted.", {
      description: `Tagged as "${eligibility.relationship ? relationshipLabels[eligibility.relationship] : "Peer"}". It will appear after verification.`,
    });
    setFormData({ name: "", university: "", department: "", year: "", comment: "", rating: 0 });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-bold flex items-center gap-2">
          <ThumbsUp className="w-3.5 h-3.5 text-primary" />
          Endorsements
          {endorsements.length > 0 && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              {endorsements.length}
            </span>
          )}
        </h3>
        {endorsements.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(parseFloat(avgRating))} size={11} />
            <span className="text-xs font-semibold text-foreground">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Endorsement cards */}
      {endorsements.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {displayed.map((endorsement, i) => (
              <motion.div
                key={endorsement.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-muted/30 border border-border relative overflow-hidden group"
              >
                <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="w-8 h-8 text-primary" />
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border border-primary/10">
                    <span className="text-xs font-bold text-primary">
                      {endorsement.endorserName.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-foreground">{endorsement.endorserName}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${relationshipColors[endorsement.relationship]}`}>
                        {relationshipLabels[endorsement.relationship]}
                      </span>
                    </div>

                    <p className="text-[10px] text-muted-foreground mb-2">
                      {endorsement.endorserDepartment} · {endorsement.endorserYear}
                    </p>

                    <StarRating rating={endorsement.rating} size={10} />

                    <p className="text-xs text-muted-foreground leading-relaxed mt-2 italic">
                      "{endorsement.comment}"
                    </p>

                    <p className="text-[9px] text-muted-foreground/60 mt-2">
                      {new Date(endorsement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {endorsements.length > 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-xs text-primary font-medium flex items-center justify-center gap-1 py-2 hover:bg-primary/5 rounded-xl transition-colors"
            >
              {showAll ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>View all {endorsements.length} endorsements <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border">
          <Users className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No endorsements yet</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Be the first to endorse {profileName}!</p>
        </div>
      )}

      {/* Add endorsement button / form */}
      <AnimatePresence>
        {!showForm ? (
          <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-primary/15 hover:bg-primary/5 gap-2 text-xs h-10"
              onClick={() => setShowForm(true)}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Endorse {profileName.split(" ")[0]}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-primary/3 border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <CrescentStar className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-xs font-semibold text-foreground">Write an Endorsement</h4>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Enter your university details — the system will automatically verify your eligibility to endorse.
              </p>

              <Input
                placeholder="Your name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs rounded-xl bg-card"
              />

              <Input
                placeholder="Your university *"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="h-9 text-xs rounded-xl bg-card"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Your department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="h-9 text-xs rounded-xl bg-card"
                />
                <Input
                  placeholder="Your year (e.g. 4th Year)"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-9 text-xs rounded-xl bg-card"
                />
              </div>

              {/* Eligibility indicator */}
              {formData.university.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    eligibility.eligible
                      ? "bg-primary/5 border-primary/15"
                      : "bg-destructive/5 border-destructive/15"
                  }`}
                >
                  {eligibility.eligible ? (
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${eligibility.eligible ? "text-primary" : "text-destructive"}`}>
                      {eligibility.eligible ? "Eligible to endorse" : "Not eligible"}
                    </p>
                    {eligibility.eligible && eligibility.relationship && (
                      <p className="text-muted-foreground mt-0.5">
                        Auto-tagged as: <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-medium border ml-1 ${relationshipColors[eligibility.relationship]}`}>
                          {relationshipLabels[eligibility.relationship]}
                        </span>
                      </p>
                    )}
                    {eligibility.eligible && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {eligibility.matchDetails.map((m) => (
                          <span key={m} className="text-[9px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded">✓ {m}</span>
                        ))}
                      </div>
                    )}
                    {!eligibility.eligible && (
                      <p className="text-muted-foreground mt-0.5">
                        Must be from <span className="font-semibold text-foreground">{profileUniversity}</span> to endorse.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5">Your rating *</p>
                <InteractiveStarRating rating={formData.rating} onRate={(r) => setFormData({ ...formData, rating: r })} />
              </div>

              <Textarea
                placeholder="Write your endorsement... *"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="text-xs rounded-xl bg-card min-h-[72px] resize-none"
                disabled={!eligibility.eligible && formData.university.trim().length > 0}
              />

              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" className="flex-1 rounded-xl text-xs h-9" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  size="sm"
                  className="flex-1 rounded-xl text-xs h-9 gap-1.5"
                  disabled={!eligibility.eligible && formData.university.trim().length > 0}
                >
                  <MessageSquarePlus className="w-3 h-3" />
                  Submit
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EndorsementSection;
