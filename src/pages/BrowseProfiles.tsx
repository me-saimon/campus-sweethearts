import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Users, GraduationCap, MapPin, X, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockProfiles, type StudentProfile } from "@/data/mockProfiles";
import ProfileCard from "@/components/ProfileCard";
import { CrescentStar, Lantern, MosqueDome } from "@/components/IslamicVectors";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const universities = ["All", "Dhaka University", "BUET", "Jahangirnagar University", "Chittagong University", "Rajshahi University", "NSU"];
const locations = ["All", "Dhaka", "Chittagong", "Rajshahi", "Savar"];

const BrowseProfiles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const { data: dbProfiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const allProfiles: StudentProfile[] = useMemo(() => {
    if (dbProfiles && dbProfiles.length > 0) {
      return dbProfiles
        .filter((p) => p.user_id !== user?.id)
        .map((p) => ({
          id: p.user_id,
          name: p.name || "Anonymous",
          age: p.age || 0,
          university: p.university || "",
          department: p.department || "",
          year: p.year || "",
          bio: p.bio || "",
          interests: p.interests || [],
          avatar: p.avatar_url || "",
          location: p.location || "",
          religion: p.religion || "Islam",
          lookingFor: p.looking_for || "",
          endorsements: [],
        }));
    }
    return mockProfiles;
  }, [dbProfiles, user?.id]);

  const filteredProfiles = useMemo(() => allProfiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.university.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
    const matchesUni = selectedUniversity === "All" || p.university === selectedUniversity;
    const matchesLoc = selectedLocation === "All" || p.location === selectedLocation;
    return matchesSearch && matchesUni && matchesLoc;
  }), [searchQuery, selectedUniversity, selectedLocation, allProfiles]);

  const activeFilters = (selectedUniversity !== "All" ? 1 : 0) + (selectedLocation !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero Header ─── */}
      <div className="relative pt-16 overflow-hidden">
        {/* layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-light via-background to-gold-light opacity-70" />
        <div className="absolute inset-0 islamic-arabesque" />
        <div className="absolute bottom-0 left-0 right-0 h-32 islamic-mosque-bg bg-repeat-x bg-bottom" />

        {/* floating Islamic vectors */}
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-20 right-[8%] hidden md:block">
          <CrescentStar className="w-10 h-10 text-primary/10" />
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-28 left-[6%] hidden md:block">
          <Lantern className="w-8 h-14 text-accent/15 lantern-glow" />
        </motion.div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, delay: 3 }} className="absolute bottom-16 right-[15%] hidden lg:block">
          <Lantern className="w-6 h-10 text-accent/10 lantern-glow" />
        </motion.div>
        <motion.div animate={{ y: [0, 6, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute bottom-20 left-[12%] hidden md:block">
          <CrescentStar className="w-6 h-6 text-accent/10" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-14 pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-5 py-2 mb-5 border border-primary/10">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Verified Profiles</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Find Your <span className="text-gradient-hero">Naseeb</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Discover verified Muslim university students looking for a halal, meaningful connection — the way it should be.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto">
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, university, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-13 rounded-2xl border-2 border-border focus:border-primary bg-card/90 backdrop-blur-md text-base shadow-card"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant={showFilters ? "default" : "outline"} size="lg" className="h-13 rounded-2xl px-5 relative" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilters > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
              <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 shadow-card relative overflow-hidden">
                <div className="absolute inset-0 islamic-stars opacity-30" />
                <div className="relative z-10 grid md:grid-cols-2 gap-6">
                  {/* University filter */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      </div>
                      University
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {universities.map((uni) => (
                        <motion.button key={uni} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedUniversity(uni)} className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all duration-300 ${selectedUniversity === uni ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>
                          {uni}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {/* Location filter */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                      </div>
                      Location
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {locations.map((loc) => (
                        <motion.button key={loc} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedLocation(loc)} className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all duration-300 ${selectedLocation === loc ? "bg-accent text-accent-foreground shadow-md shadow-accent/20" : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"}`}>
                          {loc}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                {activeFilters > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{activeFilters} filter(s) active</span>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUniversity("All"); setSelectedLocation("All"); }} className="text-xs text-primary hover:text-primary">
                      Clear all
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span><span className="font-semibold text-foreground">{filteredProfiles.length}</span> profiles found</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>All profiles verified</span>
          </div>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProfiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} onViewProfile={() => navigate(`/profile/${profile.id}`)} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProfiles.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
              Try adjusting your search or filters to discover more profiles.
            </p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setSearchQuery(""); setSelectedUniversity("All"); setSelectedLocation("All"); }}>
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowseProfiles;
