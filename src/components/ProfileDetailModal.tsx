import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, GraduationCap, BookOpen, MessageCircle, Send, Shield, Star, User, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/data/mockProfiles";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CrescentStar, Lantern, IslamicFrame } from "@/components/IslamicVectors";
import { useState } from "react";

interface ProfileDetailModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

const avatarGradients = [
  "from-primary to-emerald-dark",
  "from-accent to-gold-dark",
  "from-teal to-primary",
  "from-primary to-accent",
  "from-rose to-accent",
  "from-teal to-emerald-dark",
];

const ProfileDetailModal = ({ profile, onClose }: ProfileDetailModalProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const gradientIndex = parseInt(profile.id) % avatarGradients.length;
  const gradient = avatarGradients[gradientIndex];

  const handleShowInterest = () => {
    toast.success("MashaAllah! Interest shown successfully!", {
      description: "A proposal notification will be sent to their guardian. ৳500 fee applies.",
    });
    onClose();
  };

  const handleChat = () => {
    onClose();
    navigate("/chat");
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 40 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border relative"
      >
        {/* ─── Header ─── */}
        <div className={`bg-gradient-to-br ${gradient} p-8 rounded-t-3xl relative overflow-hidden`}>
          <div className="absolute inset-0 islamic-pattern opacity-20" />
          <div className="absolute inset-0 islamic-arabesque opacity-40" />

          {/* Floating decorations */}
          <motion.div animate={{ y: [0, -6, 0], rotate: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-4 right-20">
            <CrescentStar className="w-6 h-6 text-primary-foreground/15" />
          </motion.div>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1.5 }} className="absolute bottom-6 left-6">
            <Lantern className="w-4 h-7 text-primary-foreground/10" />
          </motion.div>

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/25 transition-all z-10">
            <X className="w-4 h-4" />
          </button>

          {/* Like button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center z-10 border border-primary-foreground/10"
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${isLiked ? 'text-accent fill-accent' : 'text-primary-foreground'}`} />
          </motion.button>

          {/* Avatar centered */}
          <div className="relative z-10 flex flex-col items-center pt-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-card border-4 border-card/50 flex items-center justify-center shadow-xl relative overflow-hidden mb-4"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15`} />
              <span className="text-3xl font-display font-bold text-gradient-hero relative z-10">
                {profile.name.charAt(0)}
              </span>
            </motion.div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-display font-bold text-primary-foreground">{profile.name}</h2>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                  <Shield className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
              <p className="text-primary-foreground/70 text-sm">{profile.age} years old</p>
            </div>
          </div>

          {/* Arch bottom */}
          <div className="absolute -bottom-px left-0 right-0 h-6 bg-card rounded-t-[2rem]" />
        </div>

        {/* ─── Body ─── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="px-6 pb-6 pt-2 space-y-5"
        >
          {/* Quick stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-2xl bg-primary/5 border border-primary/8">
              <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">{profile.location}</p>
              <p className="text-[10px] text-muted-foreground">Location</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-accent/5 border border-accent/8">
              <Clock className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">{profile.year}</p>
              <p className="text-[10px] text-muted-foreground">Year</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-rose/5 border border-rose/8">
              <User className="w-4 h-4 text-rose mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">{profile.religion}</p>
              <p className="text-[10px] text-muted-foreground">Faith</p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div variants={fadeUp} className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/8 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-5">
              <IslamicFrame className="w-16 h-16 text-primary" />
            </div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{profile.university}</h4>
                <p className="text-xs text-muted-foreground">{profile.department} · {profile.year}</p>
              </div>
            </div>
          </motion.div>

          {/* Looking For */}
          <motion.div variants={fadeUp} className="p-4 rounded-2xl bg-rose/5 border border-rose/8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-rose" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-rose uppercase tracking-wider mb-1">Looking For</h4>
                <p className="text-sm text-foreground leading-relaxed">{profile.lookingFor}</p>
              </div>
            </div>
          </motion.div>

          {/* Bio / About */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-display font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              About
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4 border border-border">
              {profile.bio}
            </p>
          </motion.div>

          {/* Interests */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-display font-bold mb-3 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-accent" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                  className="text-xs px-4 py-2 rounded-full bg-primary/8 text-primary font-medium border border-primary/10 hover:bg-primary/15 transition-colors cursor-default"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Divider with Islamic touch */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border" />
            <CrescentStar className="w-4 h-4 text-primary/20" />
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={fadeUp} className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button variant="outline" className="w-full rounded-xl h-12 border-primary/20 hover:bg-primary/10 gap-2" onClick={handleChat}>
                <MessageCircle className="w-4 h-4" />
                Start Chat
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button variant="hero" className="w-full rounded-xl h-12 gap-2" onClick={handleShowInterest}>
                <Send className="w-4 h-4" />
                Show Interest
              </Button>
            </motion.div>
          </motion.div>

          <p className="text-[11px] text-center text-muted-foreground">
            Showing interest sends a halal proposal to guardians · ৳500 fee applies
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailModal;
