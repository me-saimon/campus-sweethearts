import { motion } from "framer-motion";
import { Heart, MapPin, GraduationCap, BookOpen, Eye, Shield, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/data/mockProfiles";
import { useState } from "react";

interface ProfileCardProps {
  profile: StudentProfile;
  index: number;
  onViewProfile: () => void;
}

const avatarGradients = [
  "from-primary to-emerald-dark",
  "from-accent to-gold-dark",
  "from-teal to-primary",
  "from-primary to-accent",
  "from-rose to-accent",
  "from-teal to-emerald-dark",
];

const ProfileCard = ({ profile, index, onViewProfile }: ProfileCardProps) => {
  const gradient = avatarGradients[index % avatarGradients.length];
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.5, type: "spring" as const, stiffness: 90 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group relative bg-card rounded-3xl border border-border overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 cursor-pointer"
      onClick={onViewProfile}
    >
      {/* Subtle glow on hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-1" />

      {/* Header gradient with Islamic pattern */}
      <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 islamic-pattern opacity-25" />
        {/* Decorative arch shape */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-card rounded-t-full" />

        {/* Verified badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.05, type: "spring" as const }}
          className="absolute top-3 left-3 flex items-center gap-1 bg-primary-foreground/25 backdrop-blur-sm rounded-full px-2.5 py-1 border border-primary-foreground/10"
        >
          <Shield className="w-3 h-3 text-primary-foreground" />
          <span className="text-[10px] font-semibold text-primary-foreground">Verified</span>
        </motion.div>

        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10 hover:bg-primary-foreground/30 transition-colors"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${isLiked ? 'text-accent fill-accent scale-110' : 'text-primary-foreground'}`} />
        </motion.button>

        {/* Avatar in arch */}
        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15`} />
            <span className="text-xl font-display font-bold text-gradient-hero relative z-10">
              {profile.name.charAt(0)}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-5 pb-5 text-center">
        {/* Name */}
        <h3 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">
          {profile.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">{profile.age} years old · {profile.location}</p>

        {/* Info pills - compact */}
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-primary/5 rounded-lg px-2.5 py-1.5 border border-primary/5">
            <GraduationCap className="w-3 h-3 text-primary" />
            <span className="truncate max-w-[120px]">{profile.university}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-accent/5 rounded-lg px-2.5 py-1.5 border border-accent/5">
            <BookOpen className="w-3 h-3 text-accent" />
            <span className="truncate max-w-[100px]">{profile.department}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed px-1">{profile.bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {profile.interests.slice(0, 3).map((interest, i) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.04 }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/8"
            >
              {interest}
            </motion.span>
          ))}
          {profile.interests.length > 3 && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              +{profile.interests.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group/btn gap-2"
            onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            View Full Profile
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
