import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import {
  User, Camera, GraduationCap, MapPin, BookOpen, Heart,
  Save, Eye, Plus, X, Sparkles, ChevronsUpDown, Check, Stethoscope
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { universities } from "@/data/universities";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";

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

const medicalColleges = [
  "Dhaka Medical College",
  "Sir Salimullah Medical College",
  "Shaheed Suhrawardy Medical College",
  "Mymensingh Medical College",
  "Sher-E-Bangla Medical College, Barishal",
  "Rangpur Medical College",
  "Rajshahi Medical College",
  "Dinajpur Medical College",
  "Cumilla Medical College",
  "Chattagram Medical College",
  "Noakhali Medical College",
  "Sunamganj Medical College",
  "Faridpur Medical College",
  "Chandpur Medical College",
  "Manikganj Medical College",
  "Cox's Bazar Medical College",
  "Dhaka Dental College",
  "Jeshore Medical College",
  "Khulna Medical College",
  "Kustia Medical College",
  "Magura Medical College",
  "Mugda Medical College",
  "Naogaon Medical College",
  "Netrokona Medical College",
  "Nilphamari Medical College",
  "Pabna Medical College",
  "Patuakhali Medical College",
  "Rangamati Medical College",
  "Satkhira Medical College",
  "Shaheed M Monsur Ali Medical College, Sirajganj",
  "Shaheed Taj Uddin Ahmad Medical College, Gazipur",
  "Shaheed Ziaur Rahman Medical College, Bogura",
  "Shahid Syed Nazrul Islam Medical College, Kishoreganj",
  "Habiganj Medical College",
  "Jamalpur Medical College",
  "Tangail Medical College",
  "Gopalganj Medical College",
  "Sylhet MAG Osmani Medical College",
  "Armed Forces Medical College, Dhaka",
];

const ProfileEdit = () => {
  const [uniOpen, setUniOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: myProfile, isLoading: profileLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    university: "",
    department: "",
    year: "",
    location: "",
    religion: "Islam",
    lookingFor: "",
    bio: "",
    college: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianRelation: "",
    medicalCollege: "",
  });

  const [initialized, setInitialized] = useState(false);
  const [isMedicalStudent, setIsMedicalStudent] = useState(false);
  const [medCollegeOpen, setMedCollegeOpen] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showCollege, setShowCollege] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (myProfile && !initialized) {
      setFormData({
        name: myProfile.name || "",
        age: myProfile.age ? String(myProfile.age) : "",
        gender: myProfile.gender || "",
        university: myProfile.university || "",
        department: myProfile.department || "",
        year: myProfile.year || "",
        location: myProfile.location || "",
        religion: myProfile.religion || "Islam",
        lookingFor: myProfile.looking_for || "",
        bio: myProfile.bio || "",
        college: "",
        guardianName: "",
        guardianEmail: "",
        guardianPhone: "",
        guardianRelation: "",
        medicalCollege: "",
      });
      setSelectedInterests(myProfile.interests || []);
      setInitialized(true);
    }
  }, [myProfile, initialized]);

  if (!authLoading && !user) return <Navigate to="/login" />;

  const preferenceTags = formData.gender === "Male" ? malePreferenceTags : femalePreferenceTags;

  const togglePreference = (tag: string) => {
    setSelectedPreferences(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < 8 ? [...prev, tag] : prev
    );
  };

    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 8 ? [...prev, interest] : prev
    );
  };

  const handleSave = () => {
    updateProfile.mutate({
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      university: formData.university || null,
      department: formData.department || null,
      year: formData.year || null,
      location: formData.location || null,
      religion: formData.religion || null,
      looking_for: formData.lookingFor || null,
      bio: formData.bio || null,
      interests: selectedInterests,
    }, {
      onSuccess: () => {
        toast({
          title: "Profile Updated! ✨",
          description: "Your changes have been saved successfully.",
        });
      },
      onError: (err: any) => {
        toast({
          title: "Error",
          description: err.message || "Failed to save profile.",
          variant: "destructive",
        });
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" });
      return;
    }
    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast({ title: "Photo uploaded! 📸", description: "Your profile photo has been updated." });
      },
      onError: (err: any) => {
        toast({ title: "Upload failed", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Islamic green hero background */}
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />
        <div className="absolute inset-0 h-72 overflow-hidden">
          <div className="absolute top-6 left-12 text-secondary/30 text-3xl">☪</div>
          <div className="absolute top-10 right-16 text-secondary/20 text-2xl">☪</div>
          <div className="absolute bottom-8 right-10 text-secondary/25 text-xl">☪</div>
        </div>
      
      <div className="relative">
        {/* Subtle Islamic background decorations */}
        <div className="absolute inset-0 islamic-arabesque opacity-40 pointer-events-none" />
        <div className="absolute inset-0 islamic-mosque-bg pointer-events-none" />
        <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-secondary/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-teal/[0.03] blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-primary-foreground drop-shadow-md">
              Edit <span className="text-secondary drop-shadow-sm">Profile</span>
            </h1>
            <p className="text-primary-foreground/80">Make your profile stand out to find the perfect match</p>
          </motion.div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <Avatar className="w-28 h-28 ring-4 ring-primary/20">
                        {myProfile?.avatar_url ? (
                          <AvatarImage src={myProfile.avatar_url} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                          {(formData.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {uploadAvatar.isPending ? "Uploading..." : "Click to upload your photo"}
                    </p>
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
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
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
                  {/* Medical Student Toggle */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5">
                    <Checkbox
                      id="medical-student"
                      checked={isMedicalStudent}
                      onCheckedChange={(checked) => {
                        setIsMedicalStudent(!!checked);
                        if (!checked) {
                          setFormData({ ...formData, medicalCollege: "", university: "", department: "" });
                        } else {
                          setFormData({ ...formData, university: "", department: "MBBS" });
                        }
                      }}
                    />
                    <Label htmlFor="medical-student" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Stethoscope className="w-4 h-4 text-primary" /> I am a Medical Student
                    </Label>
                  </div>

                  {isMedicalStudent ? (
                    <>
                      <div className="space-y-2">
                        <Label>Medical College</Label>
                        <Popover open={medCollegeOpen} onOpenChange={setMedCollegeOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={medCollegeOpen}
                              className="w-full justify-between font-normal"
                            >
                              {formData.medicalCollege || "Select medical college..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search medical college..." />
                              <CommandList>
                                <CommandEmpty>No medical college found.</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-y-auto">
                                  {medicalColleges.map(mc => (
                                    <CommandItem
                                      key={mc}
                                      value={mc}
                                      onSelect={() => {
                                        setFormData({ ...formData, medicalCollege: mc });
                                        setMedCollegeOpen(false);
                                      }}
                                    >
                                      <Check className={cn("mr-2 h-4 w-4", formData.medicalCollege === mc ? "opacity-100" : "opacity-0")} />
                                      {mc}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Select value={formData.year} onValueChange={v => setFormData({ ...formData, year: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                            <SelectItem value="5th Year">5th Year</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
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
                                        setFormData({ ...formData, university: uni });
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
                          <Input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Select value={formData.year} onValueChange={v => setFormData({ ...formData, year: v })}>
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
                    </>
                  )}
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
                          onClick={() => { setShowCollege(false); setFormData({ ...formData, college: "" }); }}
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
                <CardContent className="space-y-4">
                  <CardDescription className="text-xs">Select up to 8 preferences ({selectedPreferences.length}/8)</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {preferenceTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedPreferences.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-all text-sm py-1.5 px-3 ${
                          selectedPreferences.includes(tag)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:border-primary"
                        }`}
                        onClick={() => togglePreference(tag)}
                      >
                        {selectedPreferences.includes(tag) && <X className="w-3 h-3 mr-1" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    value={formData.lookingFor}
                    onChange={e => setFormData({...formData, lookingFor: e.target.value})}
                    placeholder="Any additional preferences..."
                    className="min-h-[80px]"
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
      </div>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
