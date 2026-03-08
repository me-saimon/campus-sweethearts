import { Button } from "@/components/ui/button";
import { Shield, Sparkles, ArrowRight, Star, GraduationCap, Users, Building2, Moon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";

const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26c4.56 0 8.86-1.18 12.6-3.24A22 22 0 0 1 20 30a22 22 0 0 1 24.6-21.76C41.86 5.18 37.56 4 33 4h-1z" />
    <path d="M48 14l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
);

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Islamic-inspired background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-gradient-to-br from-emerald-light via-background to-gold-light opacity-80" />

      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Animated gradient orbs - emerald & gold */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-80 h-80 bg-emerald-light rounded-full blur-3xl opacity-40"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-light rounded-full blur-3xl opacity-15"
      />

      {/* Floating crescent moons */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: "110vh", x: `${15 + i * 18}vw`, rotate: 0, opacity: 0 }}
          animate={{ y: "-10vh", rotate: 360, opacity: [0, 0.25, 0.25, 0] }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          <CrescentStar className="w-5 h-5 text-gold drop-shadow-lg" />
        </motion.div>
      ))}

      <motion.div style={{ y: textY, opacity }} className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md border border-gold/30 rounded-full px-5 py-2.5 mb-8 shadow-card">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <CrescentStar className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground">
              Halal Matrimony Platform for Students
            </span>
            <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
              <Sparkles className="w-4 h-4 text-accent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.1] mb-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="block"
          >
            Find Your
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
            className="block text-gradient-hero relative"
          >
            Naseeb
            <motion.span
              className="absolute -right-6 -top-4 md:-right-10 md:-top-6"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CrescentStar className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            </motion.span>
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A trusted platform for Muslim university students seeking a
          <br className="hidden sm:block" />
          <span className="text-foreground font-medium">halal, family-approved</span> path to marriage.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="xl" asChild className="group relative overflow-hidden">
              <Link to="/signup">
                <span className="relative z-10 flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Begin Your Journey
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="lg" className="rounded-full border-2" asChild>
              <Link to="/browse">Browse Profiles</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Verified Students</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <CrescentStar className="w-3.5 h-3.5 text-accent" />
            <span>Halal Process</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-accent" />
            <span>Family Involved</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto"
        >
          {[
            { number: "5,000+", label: "Muslim Students", icon: GraduationCap, color: "text-primary" },
            { number: "500+", label: "Blessed Matches", icon: Users, color: "text-accent" },
            { number: "100+", label: "Universities", icon: Building2, color: "text-primary" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.08, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-card transition-all cursor-default"
            >
              <div className="flex justify-center mb-1">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-xl md:text-2xl font-display font-bold text-gradient-hero">
                {stat.number}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom arch divider - Islamic arch shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 100V60C180 20 360 0 540 0C720 0 720 40 900 40C1080 40 1080 0 1260 0C1350 0 1400 20 1440 60V100H0Z" fill="hsl(var(--card))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
