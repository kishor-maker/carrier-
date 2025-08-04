import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const featureData = [
  {
    icon: <User className="w-8 h-8 text-primary-foreground" />,
    title: 'Profile Management',
    desc: 'Create a comprehensive professional profile with photo uploads, contact information, and personal branding.',
    bg: 'bg-gradient-primary',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-accent-foreground" />,
    title: 'Career Timeline',
    desc: 'Document your professional journey with detailed career entries, achievements, and skills development over time.',
    bg: 'bg-gradient-accent',
  },
  {
    icon: <Star className="w-8 h-8 text-primary-foreground" />,
    title: 'Achievements',
    desc: "Highlight your key accomplishments, responsibilities, and the impact you've made throughout your career.",
    bg: 'bg-gradient-primary',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      type: "spring" as const,
      stiffness: 60,
    },
  }),
};

const Index = () => {
  return (
    <div className="bg-background relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <motion.div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl opacity-60 z-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-accent/30 to-primary/10 blur-2xl opacity-50 z-0"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-10 z-10"
      >
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient"
          >
            Journalize
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 60 }}
            className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto"
          >
            Your personal reflection platform for documenting professional growth, achievements, and career milestones with elegance and purpose.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
            className="inline-block"
          >
            <Link to="/career">
              <Button
                variant="premium"
                size="xl"
                className="hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-2xl"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
        className="py-8 max-w-6xl mx-auto px-4 md:px-8 z-10"
      >
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureData.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <Card className="glass border-glass-border hover-lift h-full transition-all duration-200">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className={`w-14 h-14 rounded-lg ${f.bg} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + i,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Index;
