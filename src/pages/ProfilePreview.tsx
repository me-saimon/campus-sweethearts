import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart, MapPin, GraduationCap, BookOpen, Edit, MessageCircle,
  Calendar, Star, Sparkles, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePreview = () => {
  const profile = {
    name: "Rafiq Ahmed",
    age: 24,
    university: "BUET",
    department: "Computer Science",
    year: "Masters",
    bio: "Software engineer with a love for innovation. Family-oriented and ambitious. I believe in building a life based on trust, respect, and shared dreams.",
    interests: ["Technology", "Cricket", "Photography", "Hiking"],
    location: "Dhaka",
    religion: "Islam",
    lookingFor: "Someone kind, educated, and family-oriented",
    joinedDate: "January 2025",
    profileViews: 128,
    verified: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back + Edit Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Link>
            </Button>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Star className="w-3 h-3 mr-1" /> Profile Preview
            </Badge>
          </motion.div>

          {/* Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-none overflow-hidden">
              {/* Banner */}
              <div className="h-36 bg-gradient-hero relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
              </div>
              <CardContent className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                  <Avatar className="w-28 h-28 ring-4 ring-card shadow-lg">
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                      RA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-display font-bold">{profile.name}</h1>
                      <span className="text-lg text-muted-foreground">{profile.age}</span>
                      {profile.verified && (
                        <Badge className="bg-secondary text-secondary-foreground text-xs">✓ Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/chat"><Heart className="w-4 h-4 mr-2" /> Show Interest</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/chat"><MessageCircle className="w-4 h-4 mr-2" /> Start Chat</Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/profile/edit"><Edit className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> About Me
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Academic */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-secondary" /> Academic Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">University</span>
                      <span className="font-medium">{profile.university}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{profile.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{profile.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Religion</span>
                      <span className="font-medium">{profile.religion}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" /> Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                      <Badge key={interest} variant="secondary" className="bg-primary/10 text-primary py-1.5 px-3">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Looking For */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="shadow-card border-none h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-lavender" /> Looking For
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{profile.lookingFor}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePreview;
