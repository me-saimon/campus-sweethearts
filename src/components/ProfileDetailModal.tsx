import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, GraduationCap, BookOpen, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/data/mockProfiles";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileDetailModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

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
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-hero p-6 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {profile.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-foreground">{profile.name}</h2>
                <p className="text-primary-foreground/80">{profile.age} years old • {profile.location}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-light/50">
                <GraduationCap className="w-5 h-5 text-teal" />
                <div>
                  <p className="text-sm font-medium">{profile.university}</p>
                  <p className="text-xs text-muted-foreground">{profile.department} • {profile.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-coral-light/50">
                <Heart className="w-5 h-5 text-coral" />
                <div>
                  <p className="text-sm font-medium">Looking For</p>
                  <p className="text-xs text-muted-foreground">{profile.lookingFor}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-sm font-semibold mb-2 font-display">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-sm font-semibold mb-2 font-display">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-3 py-1.5 rounded-full bg-peach text-foreground/70 font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="teal"
                className="flex-1"
                onClick={() => {
                  onClose();
                  navigate("/chat");
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleShowInterest}>
                <Send className="w-4 h-4" />
                Show Interest
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Showing interest sends a proposal to guardians • ৳500 fee applies
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileDetailModal;
