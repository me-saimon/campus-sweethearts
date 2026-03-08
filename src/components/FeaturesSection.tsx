import { Shield, MessageCircle, Heart, Users, CreditCard, Mail, ArrowUpRight, Moon } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Shield,
    title: "Verified Students",
    description: "Only verified university students can join. Your safety and dignity are our priority.",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    borderHover: "hover:border-primary/40",
  },
  {
    icon: MessageCircle,
    title: "Respectful Chat",
    description: "Chat with token limits to ensure conversations remain purposeful and respectful.",
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    borderHover: "hover:border-accent/40",
  },
  {
    icon: Heart,
    title: "Express Interest",
    description: "Found a compatible match? Express your interest and take a step toward a blessed union.",
    gradient: "from-rose/20 to-rose/5",
    iconBg: "bg-rose/15",
    iconColor: "text-rose",
    borderHover: "hover:border-rose/40",
  },
  {
    icon: Users,
    title: "Guardian Involvement",
    description: "Guardians are notified when interest is shown — keeping families involved as Islam encourages.",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    borderHover: "hover:border-primary/40",
  },
  {
    icon: Mail,
    title: "Family Notification",
    description: "Guardians receive proposal details via email for transparent, halal communication.",
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    borderHover: "hover:border-accent/40",
  },
  {
    icon: CreditCard,
    title: "Serious Proposals Only",
    description: "A small fee for marriage proposals ensures only sincere intentions — no time wasters.",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    borderHover: "hover:border-primary/40",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
  const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-6 rounded-2xl bg-card border border-border ${feature.borderHover} transition-all duration-500 cursor-default overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center`}
          >
            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
        <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-foreground transition-colors">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      {/* Islamic geometric decorative circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-accent/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full border border-primary/10"
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />

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
            className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Moon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why <span className="text-gradient-hero">UniMatch</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for Muslim university students who are serious about finding a life partner — the halal way
          </p>
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
