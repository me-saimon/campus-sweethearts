import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import {
  User, Camera, GraduationCap, MapPin, BookOpen, Heart,
  Save, Eye, Plus, X, Sparkles, ChevronsUpDown, Check, Stethoscope,
  Users, BookHeart, Scroll, Shield, Home
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
import { supabase } from "@/integrations/supabase/client";

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
  "Dhaka Medical College", "Sir Salimullah Medical College", "Shaheed Suhrawardy Medical College",
  "Mymensingh Medical College", "Sher-E-Bangla Medical College, Barishal", "Rangpur Medical College",
  "Rajshahi Medical College", "Chattagram Medical College", "Sylhet MAG Osmani Medical College",
  "Armed Forces Medical College, Dhaka"
];

const ProfileEdit = () => {
  const [uniOpen, setUniOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: myProfile, isLoading: profileLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studentIdInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", university: "", department: "", year: "",
    location: "", religion: "Islam", lookingFor: "", bio: "", college: "",
    medicalCollege: "", height: "", skinTone: "", maritalStatus: "", physicalIllness: "",
  });

  const [familyBackground, setFamilyBackground] = useState({
    fatherStatus: "", fatherOccupation: "", motherStatus: "", motherOccupation: "",
    familyValues: "", economicCondition: "", politicalView: "", siblings: "",
  });

  const [educationDetails, setEducationDetails] = useState<Array<{level: string; subject: string; details: string; year: string}>>([]);

  const [healthInterests, setHealthInterests] = useState({
    personalInterestsGoals: "",
  });

  const [religiousPractice, setReligiousPractice] = useState({
    prayerFrequency: "", religiousPhilosophy: "",
  });

  const [partnerPrefs, setPartnerPrefs] = useState({
    ageRange: "", heightRange: "", skinTone: "", maritalStatus: "",
    educationPref: "", professionPref: "", studyAfterMarriage: "",
    workAfterMarriage: "", professionExpectation: "",
  });

  const [religiousPrefs, setReligiousPrefs] = useState({
    religiousExpectations: "", preferredMahr: "", specificCharacteristics: "", otherPreferences: "",
  });

  const [relationshipViews, setRelationshipViews] = useState({
    premaritalView: "", respectEqualityView: "", maleFemaleView: "",
  });

  const [guardianInfo, setGuardianInfo] = useState({
    name: "", email: "", phone: "", relation: "",
  });

  const [initialized, setInitialized] = useState(false);
  const [isMedicalStudent, setIsMedicalStudent] = useState(false);
  const [medCollegeOpen, setMedCollegeOpen] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showCollege, setShowCollege] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [studentIdUploading, setStudentIdUploading] = useState(false);

  useEffect(() => {
    if (myProfile && !initialized) {
      setFormData({
        name: myProfile.name || "", age: myProfile.age ? String(myProfile.age) : "",
        gender: myProfile.gender || "", university: myProfile.university || "",
        department: myProfile.department || "", year: myProfile.year || "",
        location: myProfile.location || "", religion: myProfile.religion || "Islam",
        lookingFor: myProfile.looking_for || "", bio: myProfile.bio || "",
        college: "", medicalCollege: "",
        height: (myProfile as any).height || "",
        skinTone: (myProfile as any).skin_tone || "",
        maritalStatus: (myProfile as any).marital_status || "",
        physicalIllness: (myProfile as any).physical_illness || "",
      });
      setSelectedInterests(myProfile.interests || []);
      
      const fb = (myProfile as any).family_background || {};
      setFamilyBackground({
        fatherStatus: fb.fatherStatus || "", fatherOccupation: fb.fatherOccupation || "",
        motherStatus: fb.motherStatus || "", motherOccupation: fb.motherOccupation || "",
        familyValues: fb.familyValues || "", economicCondition: fb.economicCondition || "",
        politicalView: fb.politicalView || "", siblings: fb.siblings || "",
      });

      setEducationDetails((myProfile as any).education_details || []);

      const hi = (myProfile as any).health_interests || {};
      setHealthInterests({ personalInterestsGoals: hi.personalInterestsGoals || "" });

      const rp = (myProfile as any).religious_practice || {};
      setReligiousPractice({ prayerFrequency: rp.prayerFrequency || "", religiousPhilosophy: rp.religiousPhilosophy || "" });

      const pp = (myProfile as any).partner_preferences || {};
      setPartnerPrefs({
        ageRange: pp.ageRange || "", heightRange: pp.heightRange || "", skinTone: pp.skinTone || "",
        maritalStatus: pp.maritalStatus || "", educationPref: pp.educationPref || "",
        professionPref: pp.professionPref || "", studyAfterMarriage: pp.studyAfterMarriage || "",
        workAfterMarriage: pp.workAfterMarriage || "", professionExpectation: pp.professionExpectation || "",
      });

      const rpf = (myProfile as any).religious_preferences || {};
      setReligiousPrefs({
        religiousExpectations: rpf.religiousExpectations || "", preferredMahr: rpf.preferredMahr || "",
        specificCharacteristics: rpf.specificCharacteristics || "", otherPreferences: rpf.otherPreferences || "",
      });

      const rv = (myProfile as any).relationship_views || {};
      setRelationshipViews({
        premaritalView: rv.premaritalView || "", respectEqualityView: rv.respectEqualityView || "",
        maleFemaleView: rv.maleFemaleView || "",
      });

      const gi = (myProfile as any).guardian_info || {};
      setGuardianInfo({ name: gi.name || "", email: gi.email || "", phone: gi.phone || "", relation: gi.relation || "" });

      setInitialized(true);
    }
  }, [myProfile, initialized]);

  if (!authLoading && !user) return <Navigate to="/login" />;

  const preferenceTags = formData.gender === "Male" ? malePreferenceTags : femalePreferenceTags;

  const togglePreference = (tag: string) => {
    setSelectedPreferences(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 8 ? [...prev, tag] : prev
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : prev.length < 8 ? [...prev, interest] : prev
    );
  };

  const addEducation = () => {
    setEducationDetails([...educationDetails, { level: "", subject: "", details: "", year: "" }]);
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    const updated = [...educationDetails];
    updated[idx] = { ...updated[idx], [field]: value };
    setEducationDetails(updated);
  };

  const removeEducation = (idx: number) => {
    setEducationDetails(educationDetails.filter((_, i) => i !== idx));
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
      height: formData.height || null,
      skin_tone: formData.skinTone || null,
      marital_status: formData.maritalStatus || null,
      physical_illness: formData.physicalIllness || null,
      family_background: familyBackground,
      education_details: educationDetails,
      health_interests: healthInterests,
      religious_practice: religiousPractice,
      partner_preferences: partnerPrefs,
      religious_preferences: religiousPrefs,
      relationship_views: relationshipViews,
      guardian_info: guardianInfo,
    }, {
      onSuccess: () => toast({ title: "Profile Updated! ✨", description: "Your changes have been saved successfully." }),
      onError: (err: any) => toast({ title: "Error", description: err.message || "Failed to save.", variant: "destructive" }),
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
      onSuccess: () => toast({ title: "Photo uploaded! 📸", description: "Your profile photo has been updated." }),
      onError: (err: any) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
    });
  };

  const [studentIdUploading, setStudentIdUploading] = useState(false);

  const handleStudentIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" });
      return;
    }
    setStudentIdUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/student_id.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("student_ids").upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("student_ids").getPublicUrl(path);
      const { error: updateErr } = await supabase.from("profiles").update({ student_id_url: urlData.publicUrl } as any).eq("user_id", user.id);
      if (updateErr) throw updateErr;

      toast({ title: "Student ID uploaded! 🎓", description: "Your ID card is being reviewed by admin." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
    setStudentIdUploading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />
        
        <div className="relative">
          <div className="container mx-auto px-4 max-w-3xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-primary-foreground drop-shadow-md">
                Edit <span className="text-secondary drop-shadow-sm">Profile</span>
              </h1>
              <p className="text-primary-foreground/80">Complete your biodata to find the perfect match</p>
            </motion.div>

            <div className="space-y-6">
              {/* Avatar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-card border-none">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <Avatar className="w-28 h-28 ring-4 ring-primary/20">
                          {myProfile?.avatar_url ? <AvatarImage src={myProfile.avatar_url} /> : null}
                          <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-display">
                            {(formData.name || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </div>
                      <p className="text-sm text-muted-foreground">{uploadAvatar.isPending ? "Uploading..." : "Click to upload your photo"}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Personal Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Age</Label><Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Height</Label><Input value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder={"e.g. 5'7\""} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City" /></div>
                      <div className="space-y-2">
                        <Label>Religion</Label>
                        <Select value={formData.religion} onValueChange={v => setFormData({...formData, religion: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Islam">Islam</SelectItem><SelectItem value="Hinduism">Hinduism</SelectItem>
                            <SelectItem value="Buddhism">Buddhism</SelectItem><SelectItem value="Christianity">Christianity</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Skin Tone</Label>
                        <Select value={formData.skinTone} onValueChange={v => setFormData({...formData, skinTone: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fair">Fair</SelectItem><SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Olive">Olive</SelectItem><SelectItem value="Dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Marital Status</Label>
                        <Select value={formData.maritalStatus} onValueChange={v => setFormData({...formData, maritalStatus: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Never Married">Never Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell others about yourself..." className="min-h-[100px]" />
                      <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Academic Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-secondary" /> Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5">
                      <Checkbox id="medical-student" checked={isMedicalStudent} onCheckedChange={(checked) => {
                        setIsMedicalStudent(!!checked);
                        if (!checked) setFormData({...formData, medicalCollege: "", university: "", department: ""});
                        else setFormData({...formData, university: "", department: "MBBS"});
                      }} />
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
                              <Button variant="outline" className="w-full justify-between font-normal">
                                {formData.medicalCollege || "Select medical college..."}<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                              <Command><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>Not found.</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-y-auto">
                                  {medicalColleges.map(mc => (
                                    <CommandItem key={mc} value={mc} onSelect={() => { setFormData({...formData, medicalCollege: mc}); setMedCollegeOpen(false); }}>
                                      <Check className={cn("mr-2 h-4 w-4", formData.medicalCollege === mc ? "opacity-100" : "opacity-0")} />{mc}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList></Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>University</Label>
                          <Popover open={uniOpen} onOpenChange={setUniOpen}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-between font-normal">
                                {formData.university || "Select university..."}<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                              <Command><CommandInput placeholder="Search university..." /><CommandList><CommandEmpty>Not found.</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-y-auto">
                                  {universities.map(uni => (
                                    <CommandItem key={uni} value={uni} onSelect={() => { setFormData({...formData, university: uni}); setUniOpen(false); }}>
                                      <Check className={cn("mr-2 h-4 w-4", formData.university === uni ? "opacity-100" : "opacity-0")} />{uni}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList></Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Department</Label><Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} /></div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Select value={formData.year} onValueChange={v => setFormData({...formData, year: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem><SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem><SelectItem value="4th Year">4th Year</SelectItem>
                                <SelectItem value="Masters">Masters</SelectItem><SelectItem value="PhD">PhD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Education Details (SSC, HSC, etc.) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Education Details</CardTitle>
                    <CardDescription>Add your educational qualifications (SSC, HSC, Graduation, etc.)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {educationDetails.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Education #{idx + 1}</span>
                          <button onClick={() => removeEducation(idx)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Level</Label>
                            <Select value={edu.level} onValueChange={v => updateEducation(idx, "level", v)}>
                              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SSC">SSC</SelectItem><SelectItem value="HSC">HSC</SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem><SelectItem value="Graduation">Graduation</SelectItem>
                                <SelectItem value="Masters">Masters</SelectItem><SelectItem value="PhD">PhD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1"><Label className="text-xs">Subject/Group</Label><Input value={edu.subject} onChange={e => updateEducation(idx, "subject", e.target.value)} placeholder="e.g. Science, CSE" /></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1"><Label className="text-xs">Details (Result/Institution)</Label><Input value={edu.details} onChange={e => updateEducation(idx, "details", e.target.value)} placeholder="e.g. GPA-5, BRAC University" /></div>
                          <div className="space-y-1"><Label className="text-xs">Year</Label><Input value={edu.year} onChange={e => updateEducation(idx, "year", e.target.value)} placeholder="e.g. 2024" /></div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-2"><Plus className="w-4 h-4" /> Add Education</Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Family Background */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Home className="w-5 h-5 text-accent" /> Family Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Parents</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Father's Status</Label>
                        <Select value={familyBackground.fatherStatus} onValueChange={v => setFamilyBackground({...familyBackground, fatherStatus: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent><SelectItem value="Alive">Alive</SelectItem><SelectItem value="Deceased">Deceased</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Father's Occupation</Label><Input value={familyBackground.fatherOccupation} onChange={e => setFamilyBackground({...familyBackground, fatherOccupation: e.target.value})} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Mother's Status</Label>
                        <Select value={familyBackground.motherStatus} onValueChange={v => setFamilyBackground({...familyBackground, motherStatus: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent><SelectItem value="Alive">Alive</SelectItem><SelectItem value="Deceased">Deceased</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Mother's Occupation</Label><Input value={familyBackground.motherOccupation} onChange={e => setFamilyBackground({...familyBackground, motherOccupation: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2"><Label>Siblings</Label><Input value={familyBackground.siblings} onChange={e => setFamilyBackground({...familyBackground, siblings: e.target.value})} placeholder="e.g. 2 brothers, 1 sister" /></div>
                    <p className="text-sm font-medium text-muted-foreground pt-2">Family Details</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Family Values</Label>
                        <Select value={familyBackground.familyValues} onValueChange={v => setFamilyBackground({...familyBackground, familyValues: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Religious">Religious</SelectItem><SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Liberal">Liberal</SelectItem><SelectItem value="Conservative">Conservative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Economic Condition</Label>
                        <Select value={familyBackground.economicCondition} onValueChange={v => setFamilyBackground({...familyBackground, economicCondition: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Upper">Upper</SelectItem><SelectItem value="Upper Middle">Upper Middle</SelectItem>
                            <SelectItem value="Middle">Middle</SelectItem><SelectItem value="Lower Middle">Lower Middle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Family Political View</Label>
                      <Input value={familyBackground.politicalView} onChange={e => setFamilyBackground({...familyBackground, politicalView: e.target.value})} placeholder="e.g. None, Moderate" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health & Interests */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Stethoscope className="w-5 h-5 text-rose" /> Health & Interests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Physical Illness</Label>
                      <Select value={formData.physicalIllness} onValueChange={v => setFormData({...formData, physicalIllness: v})}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Yes">Yes</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Personal Interests & Career Goals</Label>
                      <Textarea value={healthInterests.personalInterestsGoals} onChange={e => setHealthInterests({...healthInterests, personalInterestsGoals: e.target.value})} placeholder="Share your hobbies, career aspirations..." className="min-h-[120px]" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interests Tags */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> Interests</CardTitle>
                    <CardDescription>Select up to 8 interests ({selectedInterests.length}/8)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(interest => (
                        <Badge key={interest} variant={selectedInterests.includes(interest) ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-sm py-1.5 px-3 ${selectedInterests.includes(interest) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/10 hover:border-primary"}`}
                          onClick={() => toggleInterest(interest)}>
                          {selectedInterests.includes(interest) && <X className="w-3 h-3 mr-1" />}{interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Religious Practice */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Scroll className="w-5 h-5 text-primary" /> Religious Practice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Prayer Frequency</Label>
                      <Select value={religiousPractice.prayerFrequency} onValueChange={v => setReligiousPractice({...religiousPractice, prayerFrequency: v})}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular (5 times daily)</SelectItem><SelectItem value="Mostly Regular">Mostly Regular</SelectItem>
                          <SelectItem value="Sometimes">Sometimes</SelectItem><SelectItem value="Rarely">Rarely</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Religious Philosophy</Label>
                      <Textarea value={religiousPractice.religiousPhilosophy} onChange={e => setReligiousPractice({...religiousPractice, religiousPhilosophy: e.target.value})} placeholder="Share your religious philosophy and views on marriage..." className="min-h-[120px]" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Partner Preferences */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-rose" /> Partner Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Basic Preferences</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Age Range</Label><Input value={partnerPrefs.ageRange} onChange={e => setPartnerPrefs({...partnerPrefs, ageRange: e.target.value})} placeholder="e.g. 27 - 35" /></div>
                      <div className="space-y-2"><Label>Height Range</Label><Input value={partnerPrefs.heightRange} onChange={e => setPartnerPrefs({...partnerPrefs, heightRange: e.target.value})} placeholder={"e.g. 5'7\" - 6'0\""} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preferred Skin Tone</Label>
                        <Select value={partnerPrefs.skinTone} onValueChange={v => setPartnerPrefs({...partnerPrefs, skinTone: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any">Any</SelectItem><SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem><SelectItem value="Dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Marital Status</Label>
                        <Select value={partnerPrefs.maritalStatus} onValueChange={v => setPartnerPrefs({...partnerPrefs, maritalStatus: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Never Married">Never Married</SelectItem><SelectItem value="Any">Any</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground pt-2">Educational & Professional</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Education</Label>
                        <Select value={partnerPrefs.educationPref} onValueChange={v => setPartnerPrefs({...partnerPrefs, educationPref: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any">Any</SelectItem><SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem><SelectItem value="PhD">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Profession</Label><Input value={partnerPrefs.professionPref} onChange={e => setPartnerPrefs({...partnerPrefs, professionPref: e.target.value})} placeholder="Any" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>View on Studying After Marriage</Label>
                        <Select value={partnerPrefs.studyAfterMarriage} onValueChange={v => setPartnerPrefs({...partnerPrefs, studyAfterMarriage: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strongly Support">Strongly Support</SelectItem><SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem><SelectItem value="Don't Support">Don't Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>View on Working After Marriage</Label>
                        <Select value={partnerPrefs.workAfterMarriage} onValueChange={v => setPartnerPrefs({...partnerPrefs, workAfterMarriage: v})}>
                          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strongly Support">Strongly Support</SelectItem><SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem><SelectItem value="Don't Support">Don't Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Profession Expectation</Label>
                      <Textarea value={partnerPrefs.professionExpectation} onChange={e => setPartnerPrefs({...partnerPrefs, professionExpectation: e.target.value})} placeholder="Your expectations about your partner's profession..." />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground pt-2">Preference Tags</p>
                    <CardDescription className="text-xs">Select up to 8 ({selectedPreferences.length}/8)</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {preferenceTags.map(tag => (
                        <Badge key={tag} variant={selectedPreferences.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-sm py-1.5 px-3 ${selectedPreferences.includes(tag) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/10 hover:border-primary"}`}
                          onClick={() => togglePreference(tag)}>
                          {selectedPreferences.includes(tag) && <X className="w-3 h-3 mr-1" />}{tag}
                        </Badge>
                      ))}
                    </div>
                    <Textarea value={formData.lookingFor} onChange={e => setFormData({...formData, lookingFor: e.target.value})} placeholder="Any additional preferences..." className="min-h-[80px]" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Religious & Personal Preferences */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><BookHeart className="w-5 h-5 text-secondary" /> Religious & Personal Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Religious Expectations</Label>
                      <Textarea value={religiousPrefs.religiousExpectations} onChange={e => setReligiousPrefs({...religiousPrefs, religiousExpectations: e.target.value})} placeholder="What religious qualities do you expect from your partner?" className="min-h-[120px]" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Preferred Mahr Amount</Label><Input value={religiousPrefs.preferredMahr} onChange={e => setReligiousPrefs({...religiousPrefs, preferredMahr: e.target.value})} placeholder="e.g. Any, Negotiable" /></div>
                      <div className="space-y-2"><Label>Specific Characteristics</Label><Input value={religiousPrefs.specificCharacteristics} onChange={e => setReligiousPrefs({...religiousPrefs, specificCharacteristics: e.target.value})} placeholder="e.g. No, Yes (specify)" /></div>
                    </div>
                    <div className="space-y-2"><Label>Other Preferences</Label><Input value={religiousPrefs.otherPreferences} onChange={e => setReligiousPrefs({...religiousPrefs, otherPreferences: e.target.value})} placeholder="Any other preferences" /></div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Relationship Views */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="shadow-card border-none">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Relationship Views</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Premarital Relationships View</Label>
                      <Textarea value={relationshipViews.premaritalView} onChange={e => setRelationshipViews({...relationshipViews, premaritalView: e.target.value})} placeholder="Your views on premarital relationships..." className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Respect, Dependence & Equality</Label>
                      <Textarea value={relationshipViews.respectEqualityView} onChange={e => setRelationshipViews({...relationshipViews, respectEqualityView: e.target.value})} placeholder="Your views on respect and equality in marriage..." className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Male-Female Friendship View</Label>
                      <Textarea value={relationshipViews.maleFemaleView} onChange={e => setRelationshipViews({...relationshipViews, maleFemaleView: e.target.value})} placeholder="Your views on male-female friendship..." className="min-h-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Guardian Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
                <Card className="shadow-card border-none border-l-4 border-l-accent">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">👨‍👩‍👧 Guardian Information</CardTitle>
                    <CardDescription>Required for the marriage proposal feature.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Guardian Name</Label><Input value={guardianInfo.name} onChange={e => setGuardianInfo({...guardianInfo, name: e.target.value})} /></div>
                      <div className="space-y-2">
                        <Label>Relation</Label>
                        <Select value={guardianInfo.relation} onValueChange={v => setGuardianInfo({...guardianInfo, relation: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Father">Father</SelectItem><SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Brother">Brother</SelectItem><SelectItem value="Uncle">Uncle</SelectItem><SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Guardian Email</Label><Input type="email" value={guardianInfo.email} onChange={e => setGuardianInfo({...guardianInfo, email: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Guardian Phone</Label><Input value={guardianInfo.phone} onChange={e => setGuardianInfo({...guardianInfo, phone: e.target.value})} /></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="hero" size="lg" className="flex-1" onClick={handleSave} disabled={updateProfile.isPending}>
                  <Save className="w-5 h-5 mr-2" /> {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/profile/${user?.id}`}><Eye className="w-5 h-5 mr-2" /> Preview Profile</Link>
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
