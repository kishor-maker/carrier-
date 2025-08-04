import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Calendar, Building2, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CareerEntry } from '@/types/career';
import { cn } from '@/lib/utils';

interface CareerEntryFormProps {
  entry?: CareerEntry;
  onSave: (entry: Omit<CareerEntry, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const CareerEntryForm: React.FC<CareerEntryFormProps> = ({
  entry,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    achievements: [''],
    responsibilities: [''],
    skills: [''],
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setFormData({
        jobTitle: entry.jobTitle,
        company: entry.company,
        startDate: entry.startDate,
        endDate: entry.endDate || '',
        isCurrentRole: entry.isCurrentRole,
        achievements: entry.achievements.length > 0 ? entry.achievements : [''],
        responsibilities: entry.responsibilities.length > 0 ? entry.responsibilities : [''],
        skills: entry.skills && entry.skills.length > 0 ? entry.skills : [''],
        description: entry.description || ''
      });
    } else {
      setFormData({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        achievements: [''],
        responsibilities: [''],
        skills: [''],
        description: ''
      });
    }
    setErrors({});
  }, [entry, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.isCurrentRole && !formData.endDate) {
      newErrors.endDate = 'End date is required for past roles';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const cleanData = {
      ...formData,
      achievements: formData.achievements.filter(item => item.trim()),
      responsibilities: formData.responsibilities.filter(item => item.trim()),
      skills: formData.skills.filter(item => item.trim()),
      endDate: formData.isCurrentRole ? undefined : formData.endDate
    };

    onSave(cleanData);
  };

  const addListItem = (field: 'achievements' | 'responsibilities' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'achievements' | 'responsibilities' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (
    field: 'achievements' | 'responsibilities' | 'skills',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="glass border-glass-border">
          <CardHeader className="border-b border-glass-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {entry ? 'Edit Career Entry' : 'Add Career Entry'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Job Title *
                  </Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className={cn(
                      "transition-all duration-300",
                      errors.jobTitle && "border-destructive focus:border-destructive"
                    )}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {errors.jobTitle && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {errors.jobTitle}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Company *
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className={cn(
                      "transition-all duration-300",
                      errors.company && "border-destructive focus:border-destructive"
                    )}
                    placeholder="e.g. Google"
                  />
                  {errors.company && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {errors.company}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Dates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className={cn(
                        "transition-all duration-300",
                        errors.startDate && "border-destructive focus:border-destructive"
                      )}
                    />
                    {errors.startDate && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.startDate}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date {!formData.isCurrentRole && '*'}
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={formData.isCurrentRole}
                      className={cn(
                        "transition-all duration-300",
                        formData.isCurrentRole && "opacity-50 bg-muted",
                        errors.endDate && "border-destructive focus:border-destructive"
                      )}
                    />
                    {errors.endDate && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.endDate}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="currentRole"
                    checked={formData.isCurrentRole}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      isCurrentRole: checked,
                      endDate: checked ? '' : prev.endDate
                    }))}
                  />
                  <Label htmlFor="currentRole">This is my current role</Label>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your role and what you did..."
                  className="min-h-[80px] resize-none"
                />
              </motion.div>

              {/* Dynamic Lists */}
              {(['responsibilities', 'achievements', 'skills'] as const).map((field, fieldIndex) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + fieldIndex * 0.05 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium capitalize">
                      {field === 'responsibilities' ? 'Key Responsibilities' : 
                       field === 'achievements' ? 'Key Achievements' : 
                       'Skills'}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addListItem(field)}
                      className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {formData[field].map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                          custom={index}
                          className="flex gap-2"
                        >
                          <Input
                            value={item}
                            onChange={(e) => updateListItem(field, index, e.target.value)}
                            placeholder={
                              field === 'responsibilities' ? 'e.g. Led a team of 5 developers' :
                              field === 'achievements' ? 'e.g. Increased performance by 30%' :
                              'e.g. React, TypeScript'
                            }
                            className="flex-1"
                          />
                          {formData[field].length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeListItem(field, index)}
                              className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Form Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end gap-3 pt-6 border-t border-glass-border"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="premium"
                  className="min-w-[100px]"
                >
                  {entry ? 'Update' : 'Add'} Entry
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};