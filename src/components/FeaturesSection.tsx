import { Shield, MessageCircle, Heart, Users, CreditCard, Mail, ArrowUpRight, Moon } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Verified Students",
    description: "Only verified university students can join. Your safety and dignity are our priority.",
    color: "primary",
  },
  {
    icon: MessageCircle,
    title: "Respectful Chat",
    description: "Chat with token limits to ensure conversations remain purposeful and respectful.",
    color: "accent",
  },
  {
    icon: Heart,
    title: "Express Interest",
    description: "Found a compatible match? Express your interest and take a step toward a blessed union.",
    color: "rose",
  },
  {
    icon: Users,
    title: "Guardian Involvement",
    description: "Guardians are notified when interest is shown — keeping families involved as Islam encourages.",
    color: "primary",
  },
  {
    icon: Mail,
    title: "Family Notification",
    description: "Guardians receive proposal details via email for transparent, halal communication.",
    color: "accent",
  },
  {
    icon: CreditCard,
    title: "Serious Proposals Only",
    description: "A small fee for marriage proposals ensures only sincere intentions — no time wasters.",
    color: "primary",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const colorMap: Record<string, { bg: string; text: string; glow: string; border: string }> = {
    primary: { bg: "bg-primary/15", text: "text-primary", glow: "shadow-[0_0_30px_hsl(var(--primary)/0.15)]", border: "border-primary/30" },
    accent: { bg: "bg-accent/15", text: "text-accent", glow: "shadow-[0_0_30px_hsl(var(--accent)/0.15)]", border: "border-accent/30" },
    rose: { bg: "bg-rose/15", text: "text-rose", glow: "shadow-[0_0_30px_hsl(var(--rose)/0.15)]", border: "border-rose/30" },
  };

  const colors = colorMap[feature.color] || colorMap.primary;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-7 rounded-2xl bg-card/80 backdrop-blur-sm border border-border transition-all duration-500 cursor-default overflow-hidden ${isHovered ? colors.glow + ' ' + colors.border : ''}`}
    >
      {/* Animated gradient border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, hsl(var(--${feature.color}) / 0.08), transparent, hsl(var(--${feature.color}) / 0.05))`,
        }}
      />

      {/* Floating shimmer on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
            transition={{ duration: 0.5 }}
            className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center relative`}
          >
            <feature.icon className={`w-7 h-7 ${colors.text}`} />
            {/* Ping animation on icon */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${colors.bg}`}
              animate={isHovered ? { scale: [1, 1.5], opacity: [0.5, 0] } : {}}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            />
          </motion.div>
          <motion.div
            animate={isHovered ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -45 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
        <h3 className="text-lg font-display font-bold mb-2 group-hover:text-foreground transition-colors">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

        {/* Bottom accent line */}
        <motion.div
          className={`h-0.5 mt-5 rounded-full bg-gradient-to-r from-${feature.color} to-transparent`}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: `linear-gradient(to right, hsl(var(--${feature.color})), transparent)` }}
        />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Decorative animated geometry */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-accent/8"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full border border-primary/8"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/[0.03]"
      />

      <div className="absolute inset-0 islamic-pattern opacity-15" />

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
            <Moon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            Why <span className="text-gradient-hero">UniMatch</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Built for Muslim university students who are serious about finding a life partner — the halal way
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
