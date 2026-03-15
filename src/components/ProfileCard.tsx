import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Eye, Shield, ShieldX, User, MapPin } from "lucide-react";
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
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-400 cursor-pointer border-2 border-secondary/30 hover:border-secondary/60"
      onClick={onViewProfile}
    >
      {/* Top gold gradient bar */}
      <div className="h-2.5 bg-gradient-to-r from-secondary via-secondary/80 to-secondary" />

      <div className="p-6">
        {/* Icon + ID header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/30 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-display font-bold text-foreground group-hover:text-secondary transition-colors">
                {uniqueId}
              </h3>
              {profile.verified ? (
                <Badge className="bg-secondary/15 text-secondary border-secondary/30 text-[11px] py-0.5 px-2 gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-[11px] py-0.5 px-2 gap-1">
                  <ShieldX className="w-3 h-3" /> Unverified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {profile.age > 0 ? `${profile.age} yrs` : "Age N/A"}
              {profile.gender && <span className="text-secondary"> · </span>}
              {profile.gender && profile.gender}
            </p>
          </div>
        </div>

        {/* Academic info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.university && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-secondary/10 rounded-xl px-3 py-1.5 border border-secondary/20 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-secondary" />
              <span className="truncate max-w-[140px]">{profile.university}</span>
            </div>
          )}
          {profile.department && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-primary/8 rounded-xl px-3 py-1.5 border border-primary/15 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[120px]">{profile.department}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-xl px-3 py-1.5 border border-border">
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
                className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold border border-secondary/20"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          size="default"
          className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md shadow-secondary/20 transition-all duration-300 gap-2 font-semibold text-sm h-11"
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
