import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Star, GraduationCap, Users, Building2, Moon } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { CrescentStar, Lantern, MosqueDome } from "@/components/IslamicVectors";

const AnimatedCounter = ({ target, label, icon: Icon, color, delay }: { target: number; label: string; icon: any; color: string; delay: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 2000;
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, target, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.08, y: -6 }}
      className="text-center p-5 rounded-2xl bg-card/70 backdrop-blur-md border border-border/50 hover:border-primary/40 hover:shadow-hover transition-all duration-500 cursor-default group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <motion.div
          className="flex justify-center mb-2"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
        </motion.div>
        <div className="text-2xl md:text-3xl font-display font-bold text-gradient-hero tabular-nums">
          {count.toLocaleString()}+
        </div>
        <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    mouseX.set(x);
    mouseY.set(y);
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { delay: 0.3 + i * 0.04, duration: 0.6, type: "spring" as const, stiffness: 100 }
    })
  };

  const titleWord1 = "Find Your";
  const titleWord2 = "Naseeb";

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Layered background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-gradient-to-br from-emerald-light via-background to-gold-light opacity-80" />
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="absolute inset-0 islamic-arabesque" />
      <div className="absolute inset-0 islamic-stars opacity-50" />

      {/* Mosque silhouette at bottom */}
      <div className="absolute bottom-12 left-0 right-0 h-40 islamic-mosque-bg bg-repeat-x bg-bottom opacity-80" />

      {/* Floating lanterns */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-24 left-[5%] hidden lg:block"
      >
        <Lantern className="w-8 h-14 text-accent/20 lantern-glow" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        className="absolute top-32 right-[7%] hidden lg:block"
      >
        <Lantern className="w-6 h-10 text-accent/15 lantern-glow" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        className="absolute top-48 left-[18%] hidden xl:block"
      >
        <Lantern className="w-5 h-8 text-accent/10 lantern-glow" />
      </motion.div>

      {/* Mosque dome decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="absolute bottom-16 left-[3%] hidden lg:block"
      >
        <MosqueDome className="w-32 h-20 text-primary/8" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="absolute bottom-16 right-[3%] hidden lg:block"
      >
        <MosqueDome className="w-28 h-18 text-primary/6" />
      </motion.div>

      {/* Mouse-reactive gradient orbs */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px]"
      />
      <motion.div
        style={{ x: useTransform(springX, v => -v * 1.5), y: useTransform(springY, v => -v * 1.5) }}
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px]"
      />

      {/* Floating crescents with varied sizes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: "110vh", x: `${8 + i * 12}vw`, rotate: 0, opacity: 0 }}
          animate={{ y: "-10vh", rotate: 360, opacity: [0, 0.15, 0.15, 0] }}
          transition={{ duration: 14 + i * 2, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
        >
          <CrescentStar className={`${i % 3 === 0 ? 'w-6 h-6' : i % 3 === 1 ? 'w-4 h-4' : 'w-3 h-3'} text-gold drop-shadow-lg`} />
        </motion.div>
      ))}

      {/* Decorative geometric rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/5"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-accent/5"
      />

      <motion.div style={{ y: textY, opacity, scale }} className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md border border-gold/30 rounded-full px-5 py-2.5 mb-8 shadow-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <CrescentStar className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground relative z-10">
              Halal Matrimony Platform for Students
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
            />
          </div>
        </motion.div>

        {/* Main heading with letter-by-letter reveal */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.1] mb-6">
          <span className="block overflow-hidden">
            {titleWord1.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
                style={{ marginRight: char === " " ? "0.3em" : "0" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="block text-gradient-hero relative overflow-hidden">
            {titleWord2.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i + titleWord1.length}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
                whileHover={{ scale: 1.2, y: -5, transition: { duration: 0.2 } }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className="absolute -right-6 -top-4 md:-right-10 md:-top-6"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CrescentStar className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A trusted platform for Muslim university students seeking a
          <br className="hidden sm:block" />
          <span className="text-foreground font-medium">halal, family-approved</span> path to marriage.
        </motion.p>

        {/* CTA Buttons with magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="xl" asChild className="group relative overflow-hidden">
              <Link to="/signup">
                <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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
            <Button variant="outline" size="lg" className="rounded-full border-2 backdrop-blur-sm" asChild>
              <Link to="/browse">Browse Profiles</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust indicators with staggered reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          {[
            { icon: Shield, label: "Verified Students", color: "text-primary" },
            { icon: CrescentStar, label: "Halal Process", color: "text-accent", isSvg: true },
            { icon: Star, label: "Family Involved", color: "text-accent" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="flex items-center gap-1.5"
            >
              {item.isSvg ? (
                <CrescentStar className={`w-3.5 h-3.5 ${item.color}`} />
              ) : (
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              )}
              <span>{item.label}</span>
              {i < 2 && <span className="ml-6 w-1 h-1 rounded-full bg-border" />}
            </motion.div>
          ))}
        </motion.div>

        {/* Animated counters */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          <AnimatedCounter target={5000} label="Muslim Students" icon={GraduationCap} color="bg-primary" delay={0} />
          <AnimatedCounter target={500} label="Blessed Matches" icon={Users} color="bg-accent" delay={200} />
          <AnimatedCounter target={100} label="Universities" icon={Building2} color="bg-primary" delay={400} />
        </div>
      </motion.div>

      {/* Bottom arch divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 100V60C180 20 360 0 540 0C720 0 720 40 900 40C1080 40 1080 0 1260 0C1350 0 1400 20 1440 60V100H0Z" fill="hsl(var(--card))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
