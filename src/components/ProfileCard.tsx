import { motion } from "framer-motion";
import { MapPin, GraduationCap, BookOpen, Eye, Shield, ShieldX, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      transition={{ delay: index * 0.06, duration: 0.45, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-hover transition-all duration-400 cursor-pointer"
      onClick={onViewProfile}
    >
      {/* Top gradient bar */}
      <div className="h-2 bg-gradient-hero" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16 ring-2 ring-primary/20 shadow-md flex-shrink-0">
            {profile.avatar ? <AvatarImage src={profile.avatar} /> : null}
            <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xl font-display">
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {uniqueId}
              </h3>
              {profile.verified ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] py-0 px-1.5 gap-0.5 flex-shrink-0">
                  <Shield className="w-2.5 h-2.5" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] py-0 px-1.5 gap-0.5 flex-shrink-0">
                  <ShieldX className="w-2.5 h-2.5" /> Unverified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile.age > 0 ? `${profile.age} yrs` : "Age N/A"}
              {profile.gender && ` · ${profile.gender}`}
              {profile.location && ` · ${profile.location}`}
            </p>
          </div>
        </div>

        {/* Academic info */}
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.university && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-primary/5 rounded-lg px-2 py-1 border border-primary/10">
              <GraduationCap className="w-3 h-3 text-primary" />
              <span className="truncate max-w-[120px]">{profile.university}</span>
            </div>
          )}
          {profile.department && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-accent/5 rounded-lg px-2 py-1 border border-accent/10">
              <BookOpen className="w-3 h-3 text-accent" />
              <span className="truncate max-w-[100px]">{profile.department}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary/5 rounded-lg px-2 py-1 border border-secondary/10">
              <MapPin className="w-3 h-3 text-secondary" />
              <span className="truncate max-w-[80px]">{profile.location}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {profile.bio || "No bio available."}
        </p>

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.interests.slice(0, 3).map((interest) => (
              <span key={interest} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium border border-primary/10">
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 gap-2"
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
