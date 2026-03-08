import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Search, MessageCircle, Heart, Mail, Infinity as InfinityIcon, Check, Moon, ChevronRight } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up with your university email. Share your details, values, and what you seek in a spouse.",
    color: "bg-primary",
    accent: "primary",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Matches",
    description: "Explore verified Muslim student profiles filtered by university, department, and shared values.",
    color: "bg-accent",
    accent: "accent",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Respectful Chat",
    description: "Connect through our token-based chat — keeping conversations purposeful and within Islamic boundaries.",
    color: "bg-primary",
    accent: "primary",
  },
  {
    icon: Heart,
    step: "04",
    title: "Express Interest",
    description: "When you've found a compatible match, express your interest to marry with sincerity.",
    color: "bg-rose",
    accent: "rose",
  },
  {
    icon: Mail,
    step: "05",
    title: "Guardian Approval",
    description: "Both guardians are notified automatically — families stay involved as Islam encourages.",
    color: "bg-accent",
    accent: "accent",
  },
  {
    icon: InfinityIcon,
    step: "06",
    title: "Blessed Connection",
    description: "Once both guardians approve, enjoy unlimited chat and plan your future together. Barakallahu lakuma!",
    color: "bg-primary",
    accent: "primary",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 100 }}
      className="relative group"
    >
      {/* Connector line between cards */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.12, duration: 0.8 }}
          className="hidden lg:block absolute top-7 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-border/0 origin-left z-20"
        />
      )}

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-hover hover:border-primary/20 transition-all duration-500 overflow-hidden h-full"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Step number watermark */}
        <div className="absolute -right-2 -top-4 text-7xl font-display font-bold text-muted/30 select-none group-hover:text-primary/10 transition-colors duration-500">
          {step.step}
        </div>

        <div className="relative z-10">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg mb-4 relative`}
          >
            <step.icon className="w-6 h-6 text-primary-foreground" />
            {/* Pulse ring */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${step.color} opacity-30`}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            />
          </motion.div>

          <h3 className="text-lg font-display font-bold mb-2 group-hover:text-gradient-hero transition-all">{step.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Bottom progress accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(to right, hsl(var(--${step.accent})), transparent)` }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.12, duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      {/* Floating decorations */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-20 opacity-8"
      >
        <Moon className="w-12 h-12 text-accent/20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 left-20 opacity-8"
      >
        <Moon className="w-8 h-8 text-primary/20" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">The Halal Process</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-hero">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A respectful, family-involved journey from profile to nikah
          </p>
        </motion.div>

        {/* Horizontal progress line */}
        <div className="hidden lg:block max-w-5xl mx-auto mb-8 relative">
          <div className="h-0.5 bg-border rounded-full">
            <motion.div
              style={{ width: lineWidth }}
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
