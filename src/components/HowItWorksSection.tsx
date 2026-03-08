import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Search, MessageCircle, Heart, Mail, Infinity as InfinityIcon, Check } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Profile",
    description: "Sign up with your university email and set up your profile with your details and preferences.",
    color: "bg-teal",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Matches",
    description: "Explore verified student profiles filtered by university, department, and interests.",
    color: "bg-coral",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Start Chatting",
    description: "Connect through our token-based chat system. Keep conversations meaningful and purposeful.",
    color: "bg-lavender",
  },
  {
    icon: Heart,
    step: "04",
    title: "Show Interest",
    description: "When you've found your match, express your interest to marry with a small fee.",
    color: "bg-rose",
  },
  {
    icon: Mail,
    step: "05",
    title: "Guardian Approval",
    description: "An automatic email is sent to both guardians. Families stay involved from the start.",
    color: "bg-gold",
  },
  {
    icon: Infinity,
    step: "06",
    title: "Unlimited Connection",
    description: "Once both guardians approve, enjoy unlimited chat and plan your beautiful future together!",
    color: "bg-secondary",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-start gap-5 p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-coral/20 transition-all duration-300 group"
      >
        {/* Step number + icon */}
        <div className="flex-shrink-0 relative">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}
          >
            <step.icon className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground">{step.step}</span>
          </div>
        </div>
        
        <div className="pt-1 flex-1">
          <h3 className="text-lg font-display font-semibold mb-1 group-hover:text-gradient-hero transition-all">{step.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Completion indicator */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.15, type: "spring" }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Check className="w-4 h-4 text-teal" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-peach/20 to-card" />
      
      {/* Floating decorations */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-20 text-4xl opacity-20"
      >
        💍
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-40 left-20 text-4xl opacity-20"
      >
        💒
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-lavender/10 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-semibold text-lavender uppercase tracking-wider">Simple Process</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-hero">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A simple, respectful journey from profile to proposal
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Animated progress line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-border hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-coral via-rose to-lavender rounded-full"
            />
          </div>

          <div className="space-y-5 md:pl-4">
            {steps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
