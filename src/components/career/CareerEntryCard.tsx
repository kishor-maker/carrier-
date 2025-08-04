import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, Edit, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CareerEntry } from '@/types/career';
import { cn } from '@/lib/utils';

interface CareerEntryCardProps {
  entry: CareerEntry;
  onEdit: (entry: CareerEntry) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const CareerEntryCard: React.FC<CareerEntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
  index
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDuration = () => {
    const start = new Date(entry.startDate);
    const end = entry.endDate ? new Date(entry.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="hover-lift glass border-glass-border overflow-hidden">
        <CardHeader className="pb-3">
          <motion.div 
            className="flex items-start justify-between"
            layout
          >
            <div className="flex-1 min-w-0">
              <motion.div layout className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {entry.jobTitle}
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    {entry.company}
                  </p>
                </div>
                {entry.isCurrentRole && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="animate-pulse-glow"
                  >
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      Current
                    </Badge>
                  </motion.div>
                )}
              </motion.div>

              <motion.div layout className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(entry.startDate)} - {' '}
                    {entry.isCurrentRole ? 'Present' : formatDate(entry.endDate!)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{getDuration()}</span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(entry)}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(entry.id)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-accent/10"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <CardContent className="pt-0">
                {entry.description && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                  >
                    <h4 className="font-medium text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {entry.description}
                    </p>
                  </motion.div>
                )}

                {entry.responsibilities.length > 0 && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mb-4"
                  >
                    <h4 className="font-medium text-foreground mb-2">Key Responsibilities</h4>
                    <ul className="space-y-1">
                      {entry.responsibilities.map((responsibility, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {responsibility}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {entry.achievements.length > 0 && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <h4 className="font-medium text-foreground mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {entry.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.25 + idx * 0.05 }}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {entry.skills && entry.skills.length > 0 && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <h4 className="font-medium text-foreground mb-2">Skills Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.skills.map((skill, idx) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + idx * 0.03 }}
                        >
                          <Badge variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};