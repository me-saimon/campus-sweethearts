import { motion } from "framer-motion";
import { Heart, MapPin, GraduationCap, BookOpen, Eye, Shield } from "lucide-react";
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-hover hover:border-primary/20 transition-all duration-500"
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      {/* Header gradient with pattern */}
      <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 islamic-pattern opacity-20" />

        {/* Verified badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.08, type: "spring" }}
          className="absolute top-3 left-3 flex items-center gap-1 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-2.5 py-1"
        >
          <Shield className="w-3 h-3 text-primary-foreground" />
          <span className="text-[10px] font-semibold text-primary-foreground">Verified</span>
        </motion.div>

        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 transition-all ${isLiked ? 'text-accent fill-accent scale-110' : 'text-primary-foreground'}`} />
        </motion.button>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-5">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 rounded-xl bg-card border-[3px] border-card flex items-center justify-center shadow-lg relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15`} />
            <span className="text-xl font-display font-bold text-gradient-hero relative z-10">
              {profile.name.charAt(0)}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="pt-11 px-5 pb-5">
        {/* Name & age */}
        <div className="mb-3">
          <h3 className="text-base font-display font-bold text-foreground group-hover:text-gradient-hero transition-all">
            {profile.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.age} years old</p>
        </div>

        {/* Info pills */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-3 h-3 text-primary" />
            </div>
            <span className="truncate">{profile.university}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3 h-3 text-accent" />
            </div>
            <span className="truncate">{profile.department} · {profile.year}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-rose/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3 h-3 text-rose" />
            </div>
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{profile.bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.interests.slice(0, 3).map((interest, i) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/10"
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
            className="w-full rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group/btn"
            onClick={onViewProfile}
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            View Profile
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
