import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Briefcase, Download, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProfilePhotoUpload } from '@/components/career/ProfilePhotoUpload';
import { CareerEntryCard } from '@/components/career/CareerEntryCard';
import { CareerEntryForm } from '@/components/career/CareerEntryForm';
import { CareerEntry, ProfileData } from '@/types/career';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CareerDetails: React.FC = () => {
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications and leading development teams.'
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(true); // Start in edit mode for new users
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);
  
  // Career entries state
  const [careerEntries, setCareerEntries] = useState<CareerEntry[]>([
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      startDate: '2022-01-01',
      isCurrentRole: true,
      achievements: [
        'Led the development of a new microservice architecture that improved system performance by 40%',
        'Mentored 5 junior developers and helped them advance their careers',
        'Reduced deployment time from 2 hours to 15 minutes by implementing CI/CD pipelines'
      ],
      responsibilities: [
        'Design and implement scalable web applications using React and Node.js',
        'Lead code reviews and maintain high code quality standards',
        'Collaborate with product managers and designers to deliver user-centric solutions',
        'Optimize application performance and troubleshoot production issues'
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
      description: 'Leading the development of next-generation cloud infrastructure tools that serve millions of users worldwide.'
    },
    {
      id: '2',
      jobTitle: 'Software Engineer',
      company: 'Meta',
      startDate: '2019-06-01',
      endDate: '2021-12-31',
      isCurrentRole: false,
      achievements: [
        'Built a real-time messaging system that handles 1M+ messages per day',
        'Improved mobile app load time by 60% through code optimization',
        'Won the Q3 2020 Innovation Award for outstanding technical contribution'
      ],
      responsibilities: [
        'Developed mobile applications using React Native',
        'Implemented real-time features using WebSocket technology',
        'Participated in on-call rotation for production support',
        'Contributed to open-source projects and internal developer tools'
      ],
      skills: ['React Native', 'JavaScript', 'Redux', 'GraphQL', 'MongoDB'],
      description: 'Developed mobile and web applications for social media platforms with focus on real-time communication features.'
    }
  ]);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CareerEntry | undefined>();

  useEffect(() => {
    // Load data from localStorage or API
    const savedProfile = localStorage.getItem('journalize-profile');
    const savedEntries = localStorage.getItem('journalize-career-entries');
    
    if (savedProfile) {
      const loadedProfile = JSON.parse(savedProfile);
      setProfile(loadedProfile);
      setTempProfile(loadedProfile);
      setIsEditingProfile(false); // Disable edit mode if profile exists
    } else {
      // Keep edit mode enabled for new users
      setIsEditingProfile(true);
    }
    
    if (savedEntries) {
      setCareerEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveToStorage = (newProfile: ProfileData, newEntries: CareerEntry[]) => {
    localStorage.setItem('journalize-profile', JSON.stringify(newProfile));
    localStorage.setItem('journalize-career-entries', JSON.stringify(newEntries));
  };

  const handleProfileSave = () => {
    setProfile(tempProfile);
    setIsEditingProfile(false);
    saveToStorage(tempProfile, careerEntries);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleProfileCancel = () => {
    setTempProfile(profile);
    setIsEditingProfile(false);
  };

  const handleImageChange = (imageUrl: string) => {
    setTempProfile(prev => ({ ...prev, profileImage: imageUrl }));
  };

  const handleAddEntry = () => {
    setEditingEntry(undefined);
    setShowForm(true);
  };

  const handleEditEntry = (entry: CareerEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleSaveEntry = (entryData: Omit<CareerEntry, 'id'>) => {
    const newEntries = [...careerEntries];
    
    if (editingEntry) {
      // Update existing entry
      const index = newEntries.findIndex(e => e.id === editingEntry.id);
      if (index !== -1) {
        newEntries[index] = { ...entryData, id: editingEntry.id };
        toast({
          title: "Entry updated",
          description: "Your career entry has been updated successfully.",
        });
      }
    } else {
      // Add new entry
      const newEntry: CareerEntry = {
        ...entryData,
        id: Date.now().toString()
      };
      newEntries.unshift(newEntry);
      toast({
        title: "Entry added",
        description: "Your new career entry has been added successfully.",
      });
    }
    
    setCareerEntries(newEntries);
    saveToStorage(profile, newEntries);
    setShowForm(false);
    setEditingEntry(undefined);
  };

  const handleDeleteEntry = (id: string) => {
    const newEntries = careerEntries.filter(entry => entry.id !== id);
    setCareerEntries(newEntries);
    saveToStorage(profile, newEntries);
    toast({
      title: "Entry deleted",
      description: "Your career entry has been removed.",
      variant: "destructive"
    });
  };

  const handleExportData = () => {
    const exportData = {
      profile,
      careerEntries,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journalize-career-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your career data has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Improved Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-hero"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-3 mb-2 px-4 py-1.5 rounded-full glass border-glass-border"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Professional Portfolio</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-1 bg-gradient-primary bg-clip-text text-transparent">
              Career Journey
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Document your professional growth, achievements, and experiences in one beautiful place.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-12 mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="glass border-glass-border sticky top-4">
              <CardHeader className="border-b border-glass-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Profile
                    {!isEditingProfile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-2"
                      >
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          Read-only
                        </Badge>
                      </motion.div>
                    )}
                    {isEditingProfile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-2"
                      >
                        <Badge variant="default" className="text-xs bg-primary text-primary-foreground animate-pulse-glow">
                          Editing
                        </Badge>
                      </motion.div>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExportData}
                      className="hover:bg-accent/10 hover:text-accent"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {!isEditingProfile ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingProfile(true)}
                        className="hover:bg-primary/10 hover:text-primary"
                        title="Click to edit profile"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleProfileSave}
                          className="hover:bg-success/10 hover:text-success"
                          title="Save changes"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleProfileCancel}
                          className="hover:bg-destructive/10 hover:text-destructive"
                          title="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditingProfile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground mt-2"
                  >
                    Click the edit button <Edit className="w-3 h-3 inline mx-1" /> to modify your profile
                  </motion.p>
                )}
              </CardHeader>

              <CardContent className="p-6">
                {/* Profile Photo */}
                <div className="flex justify-center mb-6">
                  <ProfilePhotoUpload
                    currentImage={tempProfile.profileImage}
                    onImageChange={handleImageChange}
                  />
                </div>

                {/* Profile Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name {isEditingProfile && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="name"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "Enter your full name" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Professional Title {isEditingProfile && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="title"
                      value={tempProfile.title}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "e.g. Senior Software Engineer" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email {isEditingProfile && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "your.email@example.com" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input
                      id="phone"
                      value={tempProfile.phone || ''}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "+1 (555) 123-4567" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={tempProfile.location || ''}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "City, State/Country" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-sm font-medium">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={tempProfile.summary || ''}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, summary: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={cn(
                        "min-h-[100px] resize-none transition-all duration-300",
                        !isEditingProfile && "bg-muted/50 cursor-not-allowed",
                        isEditingProfile && "border-primary/20 focus:border-primary"
                      )}
                      placeholder={isEditingProfile ? "Brief summary of your professional background, skills, and experience..." : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Career Timeline</h2>
                  <p className="text-muted-foreground">Your professional journey</p>
                </div>
              </div>
              
              <Button
                onClick={handleAddEntry}
                variant="premium"
                className="hover-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <Card className="glass border-glass-border text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {careerEntries.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Positions</div>
              </Card>
              
              <Card className="glass border-glass-border text-center p-4">
                <div className="text-2xl font-bold text-accent mb-1">
                  {careerEntries.reduce((total, entry) => total + entry.achievements.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </Card>
              
              <Card className="glass border-glass-border text-center p-4">
                <div className="text-2xl font-bold text-success mb-1">
                  {careerEntries.filter(entry => entry.isCurrentRole).length}
                </div>
                <div className="text-sm text-muted-foreground">Current Roles</div>
              </Card>
            </motion.div>

            {/* Career Entries */}
            <div className="space-y-6">
              <AnimatePresence>
                {careerEntries.length > 0 ? (
                  careerEntries.map((entry, index) => (
                    <CareerEntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={handleEditEntry}
                      onDelete={handleDeleteEntry}
                      index={index}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No career entries yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start documenting your professional journey by adding your first career entry.
                    </p>
                    <Button onClick={handleAddEntry} variant="premium">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Experience
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Career Entry Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CareerEntryForm
            entry={editingEntry}
            onSave={handleSaveEntry}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(undefined);
            }}
            isOpen={showForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerDetails;