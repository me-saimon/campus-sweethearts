import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, GraduationCap, BookOpen, MessageCircle, Send, Shield, Moon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/data/mockProfiles";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileDetailModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26c4.56 0 8.86-1.18 12.6-3.24A22 22 0 0 1 20 30a22 22 0 0 1 24.6-21.76C41.86 5.18 37.56 4 33 4h-1z" />
    <path d="M48 14l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
);

const ProfileDetailModal = ({ profile, onClose }: ProfileDetailModalProps) => {
  const navigate = useNavigate();

  const handleShowInterest = () => {
    toast.success("Interest shown! A proposal email will be sent to guardians.", {
      description: "A small fee of ৳500 will be charged for the proposal.",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-border"
        >
          {/* Header with Islamic design */}
          <div className="bg-gradient-islamic p-7 rounded-t-3xl relative overflow-hidden">
            <div className="absolute inset-0 islamic-pattern opacity-15" />

            {/* Floating crescent */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-4 right-16"
            >
              <CrescentStar className="w-5 h-5 text-accent/30" />
            </motion.div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/25 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
              >
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {profile.name.charAt(0)}
                </span>
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-display font-bold text-primary-foreground">{profile.name}</h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center"
                  >
                    <Shield className="w-3 h-3 text-accent" />
                  </motion.div>
                </div>
                <p className="text-primary-foreground/70 text-sm">{profile.age} years old · {profile.location}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">University</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{profile.university}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3.5 rounded-xl bg-accent/5 border border-accent/10 group hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Department</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{profile.department} · {profile.year}</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-3.5 rounded-xl bg-rose/5 border border-rose/10 hover:bg-rose/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Heart className="w-4 h-4 text-rose" />
                <span className="text-[10px] font-semibold text-rose uppercase tracking-wider">Looking For</span>
              </div>
              <p className="text-sm text-foreground">{profile.lookingFor}</p>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-display font-bold mb-2 flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-primary" />
                About
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
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
                    transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-primary/8 text-primary font-medium border border-primary/10 hover:bg-primary/15 transition-colors cursor-default"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex gap-3 pt-3"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-primary/20 hover:bg-primary/10"
                  onClick={() => { onClose(); navigate("/chat"); }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button variant="hero" className="w-full rounded-xl" onClick={handleShowInterest}>
                  <Send className="w-4 h-4" />
                  Show Interest
                </Button>
              </motion.div>
            </motion.div>

            <p className="text-[11px] text-center text-muted-foreground pt-1">
              Showing interest sends a proposal to guardians · ৳500 fee applies
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileDetailModal;
