import { motion } from "framer-motion";
import { Heart, MapPin, GraduationCap, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/data/mockProfiles";

interface ProfileCardProps {
  profile: StudentProfile;
  index: number;
  onViewProfile: () => void;
}

const avatarColors = [
  "from-coral to-rose",
  "from-teal to-secondary",
  "from-lavender to-coral",
  "from-gold to-coral",
  "from-rose to-lavender",
  "from-secondary to-teal",
];

const ProfileCard = ({ profile, index, onViewProfile }: ProfileCardProps) => {
  const colorClass = avatarColors[index % avatarColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Avatar area */}
      <div className={`h-32 bg-gradient-to-br ${colorClass} relative`}>
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-lg">
            <span className="text-2xl font-display font-bold text-gradient-hero">
              {profile.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-12 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-display font-semibold">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.age} years old</p>
          </div>
          <Heart className="w-5 h-5 text-coral/40 group-hover:text-coral transition-colors cursor-pointer hover:fill-current" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-teal" />
            <span>{profile.university}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 text-lavender" />
            <span>{profile.department} • {profile.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-coral" />
            <span>{profile.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{profile.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-xs px-2.5 py-1 rounded-full bg-peach text-foreground/70 font-medium"
            >
              {interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              +{profile.interests.length - 3}
            </span>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={onViewProfile}>
          <Eye className="w-4 h-4" />
          View Profile
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
