import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Users, GraduationCap, MapPin, X, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { CrescentStar, Lantern } from "@/components/IslamicVectors";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const BrowseProfiles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 45]);

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

  const allProfiles = useMemo(() => {
    if (!dbProfiles || dbProfiles.length === 0) return [];
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
        gender: p.gender || "",
        verified: (p as any).verified || false,
      }));
  }, [dbProfiles, user?.id]);

  const filteredProfiles = useMemo(() => allProfiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.university.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchesGender = genderFilter === "All" || p.gender === genderFilter;
    const matchesAge = p.age === 0 || (p.age >= ageRange[0] && p.age <= ageRange[1]);
    return matchesSearch && matchesGender && matchesAge;
  }), [searchQuery, genderFilter, ageRange, allProfiles]);

  const activeFilters = (genderFilter !== "All" ? 1 : 0) + (ageRange[0] !== 18 || ageRange[1] !== 45 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-light via-background to-gold-light opacity-70" />
        <div className="absolute inset-0 islamic-arabesque" />

        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-20 right-[8%] hidden md:block">
          <CrescentStar className="w-10 h-10 text-primary/10" />
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-28 left-[6%] hidden md:block">
          <Lantern className="w-8 h-14 text-accent/15 lantern-glow" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-14 pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-5 py-2 mb-5 border border-primary/10">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Verified Profiles</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Find Your <span className="text-gradient-hero">Naseeb</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Discover verified Muslim university students looking for a halal, meaningful connection.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto">
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by university, department, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-13 rounded-2xl border-2 border-border focus:border-primary bg-card/90 backdrop-blur-md text-base shadow-card"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant={showFilters ? "default" : "outline"} size="lg" className="h-13 rounded-2xl px-5 relative" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilters > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
              <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 shadow-card">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-primary" />
                      </div>
                      Gender
                    </Label>
                    <div className="flex gap-2 mt-2">
                      {["All", "Male", "Female"].map((g) => (
                        <motion.button key={g} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGenderFilter(g)}
                          className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${genderFilter === g ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>
                          {g}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {/* Age */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                      </div>
                      Age Range: {ageRange[0]} - {ageRange[1]}
                    </Label>
                    <div className="mt-4 px-2">
                      <Slider
                        min={18} max={45} step={1}
                        value={ageRange}
                        onValueChange={(v) => setAgeRange(v as [number, number])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                {activeFilters > 0 && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{activeFilters} filter(s) active</span>
                    <Button variant="ghost" size="sm" onClick={() => { setGenderFilter("All"); setAgeRange([18, 45]); }} className="text-xs text-primary hover:text-primary">Clear all</Button>
                  </div>
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
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} onViewProfile={() => navigate(`/profile/${profile.id}`)} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">Try adjusting your search or filters.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setSearchQuery(""); setGenderFilter("All"); setAgeRange([18, 45]); }}>Clear all filters</Button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowseProfiles;
