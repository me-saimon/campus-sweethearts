import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User, Camera, GraduationCap, MapPin, BookOpen, Heart,
  Save, Eye, Plus, X, Sparkles, ChevronsUpDown, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { universities } from "@/data/universities";

const interestOptions = [
  "Reading", "Writing", "Cooking", "Travel", "Photography", "Music",
  "Sports", "Technology", "Art", "Gardening", "Volunteering", "Gaming",
  "Hiking", "Cricket", "Football", "Poetry", "Calligraphy", "Chess",
  "Medicine", "Business", "Engineering", "Nature"
];

const malePreferenceTags = [
  "Into Cooking", "Be a Housewife", "Will Work if Needed", "Travelling",
  "Knitting", "Religious", "Family-oriented", "Educated", "Caring",
  "Modest", "Creative", "Supportive", "Health-conscious"
];

const femalePreferenceTags = [
  "Provider", "Religious", "Family-oriented", "Educated", "Ambitious",
  "Caring", "Respectful", "Supportive", "Honest", "Health-conscious",
  "Good with Kids", "Financially Stable", "Humble"
];

const ProfileEdit = () => {
  const [uniOpen, setUniOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "Rafiq Ahmed",
    age: "24",
    university: "Bangladesh University of Engineering & Technology",
    department: "Computer Science",
    year: "Masters",
    location: "Dhaka",
    religion: "Islam",
    lookingFor: "Someone kind, educated, and family-oriented",
    bio: "Software engineer with a love for innovation. Family-oriented and ambitious.",
    college: "",
    guardianName: "Mr. Ahmed Hossain",
    guardianEmail: "guardian@example.com",
    guardianPhone: "+880171XXXXXXX",
    guardianRelation: "Father",
  });
  const [showCollege, setShowCollege] = useState(false);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Technology", "Cricket", "Photography", "Hiking"
  ]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 8 ? [...prev, interest] : prev
    );
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Edit <span className="text-gradient-hero">Profile</span>
            </h1>
            <p className="text-muted-foreground">Make your profile stand out to find the perfect match</p>
          </motion.div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <Avatar className="w-28 h-28 ring-4 ring-primary/20">
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                          RA
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">Click to upload your photo</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="shadow-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                  </CardTitle>
                  <CardDescription>Basic details about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label>Religion</Label>
                      <Select value={formData.religion} onValueChange={v => setFormData({...formData, religion: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Islam">Islam</SelectItem>
                          <SelectItem value="Hinduism">Hinduism</SelectItem>
                          <SelectItem value="Buddhism">Buddhism</SelectItem>
                          <SelectItem value="Christianity">Christianity</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell others about yourself..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/300</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Academic Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-secondary" /> Academic Information
                  </CardTitle>
                  <CardDescription>Your university details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>University</Label>
                    <Popover open={uniOpen} onOpenChange={setUniOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={uniOpen}
                          className="w-full justify-between font-normal"
                        >
                          {formData.university || "Select university..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search university..." />
                          <CommandList>
                            <CommandEmpty>No university found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {universities.map(uni => (
                                <CommandItem
                                  key={uni}
                                  value={uni}
                                  onSelect={() => {
                                    setFormData({...formData, university: uni});
                                    setUniOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", formData.university === uni ? "opacity-100" : "opacity-0")} />
                                  {uni}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Select value={formData.year} onValueChange={v => setFormData({...formData, year: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="Masters">Masters</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {!showCollege ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit gap-2"
                      onClick={() => setShowCollege(true)}
                    >
                      <Plus className="w-4 h-4" /> Add College
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>College</Label>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => { setShowCollege(false); setFormData({...formData, college: ""}); }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Input
                        value={formData.college}
                        onChange={e => setFormData({...formData, college: e.target.value})}
                        placeholder="Enter your college name"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Interests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="shadow-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> Interests
                  </CardTitle>
                  <CardDescription>Select up to 8 interests ({selectedInterests.length}/8)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map(interest => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-all text-sm py-1.5 px-3 ${
                          selectedInterests.includes(interest)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:border-primary"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {selectedInterests.includes(interest) && <X className="w-3 h-3 mr-1" />}
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Partner Preferences */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose" /> Partner Preferences
                  </CardTitle>
                  <CardDescription>What are you looking for?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.lookingFor}
                    onChange={e => setFormData({...formData, lookingFor: e.target.value})}
                    placeholder="Describe what you're looking for in a life partner..."
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Guardian Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="shadow-card border-none border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    👨‍👩‍👧 Guardian Information
                  </CardTitle>
                  <CardDescription>Required for the marriage proposal feature. Guardian will be notified when someone shows interest.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Guardian Name</Label>
                      <Input value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Select value={formData.guardianRelation} onValueChange={v => setFormData({...formData, guardianRelation: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Brother">Brother</SelectItem>
                          <SelectItem value="Uncle">Uncle</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Guardian Email</Label>
                      <Input type="email" value={formData.guardianEmail} onChange={e => setFormData({...formData, guardianEmail: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Guardian Phone</Label>
                      <Input value={formData.guardianPhone} onChange={e => setFormData({...formData, guardianPhone: e.target.value})} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Button variant="hero" size="lg" className="flex-1" onClick={handleSave}>
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/profile/preview"><Eye className="w-5 h-5 mr-2" /> Preview Profile</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
