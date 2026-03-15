import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Eye, Shield, ShieldX, User, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    university: string;
    department: string;
    bio: string;
    interests: string[];
    avatar: string;
    location: string;
    gender?: string;
    verified?: boolean;
  };
  index: number;
  onViewProfile: () => void;
}

const generateUniqueId = (id: string) => {
  const hash = id.replace(/-/g, "").slice(0, 7).toUpperCase();
  return `UM-${hash}`;
};

const ProfileCard = ({ profile, index, onViewProfile }: ProfileCardProps) => {
  const uniqueId = generateUniqueId(profile.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.45, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 cursor-pointer border border-primary/20 hover:border-primary/50"
      onClick={onViewProfile}
    >
      {/* Top gradient bar - green */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

      <div className="p-6 relative">
        {/* Icon + ID header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/10 w-[72px] h-[72px]">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                {uniqueId}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {profile.verified ? (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[11px] py-0.5 px-2.5 gap-1 font-semibold">
                  <Shield className="w-3 h-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-[11px] py-0.5 px-2.5 gap-1">
                  <ShieldX className="w-3 h-3" /> Unverified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1.5">
              {profile.age > 0 ? `${profile.age} yrs` : "Age N/A"}
              {profile.gender && <span className="text-primary font-bold"> · </span>}
              {profile.gender && <span className="capitalize">{profile.gender}</span>}
            </p>
          </div>
        </div>

        {/* Academic info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.university && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-primary/10 rounded-xl px-3 py-2 border border-primary/20 font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[150px]">{profile.university}</span>
            </div>
          )}
          {profile.department && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-secondary/10 rounded-xl px-3 py-2 border border-secondary/20 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-secondary" />
              <span className="truncate max-w-[130px]">{profile.department}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 rounded-xl px-3 py-2 border border-border font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{profile.location}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {profile.bio || "No bio available."}
        </p>

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {profile.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-medium">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          size="default"
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 gap-2 font-bold text-sm h-12"
          onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
        >
          <Eye className="w-4 h-4" />
          View Profile
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
