import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Eye, Shield, User } from "lucide-react";
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
      className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-400 cursor-pointer border border-border/50"
      onClick={onViewProfile}
      style={{ background: "hsl(var(--card))" }}
    >
      {/* Green gradient header area */}
      <div className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 px-6 pt-6 pb-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        {/* User icon */}
        <div className="w-16 h-16 rounded-full bg-primary-foreground/15 border-2 border-primary-foreground/30 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-primary-foreground/80" />
        </div>

        {/* Unique ID */}
        <h3 className="text-2xl font-display font-black text-primary-foreground tracking-tight">
          {uniqueId}
        </h3>

        {/* Age & Gender */}
        <p className="text-sm text-primary-foreground/70 font-medium mt-1">
          {profile.age > 0 ? `${profile.age} yrs` : "AGE N/A"}
          {profile.gender && <span className="text-primary-foreground/50"> · </span>}
          {profile.gender && <span className="uppercase">{profile.gender}</span>}
        </p>

        {/* Verified badge */}
        <div className="mt-2">
          {profile.verified ? (
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-[11px] py-0.5 px-3 gap-1 font-semibold backdrop-blur-sm">
              <Shield className="w-3 h-3" /> Verified
            </Badge>
          ) : (
            <Badge className="bg-accent/30 text-accent-foreground border-accent/40 text-[11px] py-0.5 px-3 gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" /> Unverified
            </Badge>
          )}
        </div>
      </div>

      {/* Card body - dark section */}
      <div className="px-6 pt-5 pb-6 space-y-4">
        {/* Academic chips */}
        <div className="flex flex-wrap gap-2">
          {profile.university && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted rounded-full px-3 py-1.5 border border-border font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[120px]">{profile.university}</span>
            </div>
          )}
          {profile.department && (
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted rounded-full px-3 py-1.5 border border-border font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[100px]">{profile.department}</span>
            </div>
          )}
        </div>

        {/* Structured info */}
        <div className="grid grid-cols-3 gap-3 border-t border-border/50 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Status</p>
            <p className="text-xs text-foreground font-semibold mt-0.5">
              {profile.verified ? "Verified" : "Unverified"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Program</p>
            <p className="text-xs text-foreground font-semibold mt-0.5 truncate">
              {profile.department || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Institute</p>
            <p className="text-xs text-foreground font-semibold mt-0.5 truncate">
              {profile.university || "N/A"}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground italic line-clamp-2 leading-relaxed">
          {profile.bio || "No bio available."}
        </p>

        {/* CTA Button */}
        <Button
          size="default"
          variant="outline"
          className="w-full rounded-xl border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 gap-2 font-bold text-sm h-12"
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
