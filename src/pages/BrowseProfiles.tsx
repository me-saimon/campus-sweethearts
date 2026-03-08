import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, GraduationCap, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockProfiles, type StudentProfile } from "@/data/mockProfiles";
import ProfileCard from "@/components/ProfileCard";
import ProfileDetailModal from "@/components/ProfileDetailModal";

const BrowseProfiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);

  const filteredProfiles = mockProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Browse <span className="text-gradient-hero">Profiles</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Discover verified university students looking for a meaningful connection
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, university, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-2 border-border focus:border-coral bg-card text-base"
              />
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                index={index}
                onViewProfile={() => setSelectedProfile(profile)}
              />
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No profiles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

export default BrowseProfiles;
