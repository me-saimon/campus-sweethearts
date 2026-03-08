import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Users, GraduationCap, MapPin, X, Moon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockProfiles, type StudentProfile } from "@/data/mockProfiles";
import ProfileCard from "@/components/ProfileCard";
import ProfileDetailModal from "@/components/ProfileDetailModal";

const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26c4.56 0 8.86-1.18 12.6-3.24A22 22 0 0 1 20 30a22 22 0 0 1 24.6-21.76C41.86 5.18 37.56 4 33 4h-1z" />
    <path d="M48 14l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
);

const universities = ["All", "Dhaka University", "BUET", "Jahangirnagar University", "Chittagong University", "Rajshahi University", "NSU"];
const locations = ["All", "Dhaka", "Chittagong", "Rajshahi", "Savar"];

const BrowseProfiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filteredProfiles = mockProfiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUni = selectedUniversity === "All" || p.university === selectedUniversity;
    const matchesLoc = selectedLocation === "All" || p.location === selectedLocation;
    return matchesSearch && matchesUni && matchesLoc;
  });

  const activeFilters = (selectedUniversity !== "All" ? 1 : 0) + (selectedLocation !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero header */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-light via-background to-gold-light opacity-60" />
        <div className="absolute inset-0 islamic-pattern opacity-15" />

        {/* Floating decorations */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-24 right-[10%]"
        >
          <CrescentStar className="w-8 h-8 text-accent/20" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-8 left-[8%]"
        >
          <Moon className="w-6 h-6 text-primary/15" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2 mb-5"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Verified Profiles</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Find Your <span className="text-gradient-hero">Naseeb</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Discover verified Muslim university students looking for a halal, meaningful connection
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, university, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-13 rounded-2xl border-2 border-border focus:border-primary bg-card/80 backdrop-blur-sm text-base shadow-card"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="lg"
                  className="h-13 rounded-2xl px-5 relative"
                  onClick={() => setShowFilters(!showFilters)}
                >
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

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-6 relative z-10 pb-16">
        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* University filter */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      University
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {universities.map((uni) => (
                        <motion.button
                          key={uni}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedUniversity(uni)}
                          className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all duration-300 ${
                            selectedUniversity === uni
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {uni}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Location filter */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      Location
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {locations.map((loc) => (
                        <motion.button
                          key={loc}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedLocation(loc)}
                          className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all duration-300 ${
                            selectedLocation === loc
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {loc}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeFilters > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-border flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground">{activeFilters} filter(s) active</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedUniversity("All"); setSelectedLocation("All"); }}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              <span className="font-semibold text-foreground">{filteredProfiles.length}</span> profiles found
            </span>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Try adjusting your search or filters to discover more profiles.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => { setSearchQuery(""); setSelectedUniversity("All"); setSelectedLocation("All"); }}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
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
