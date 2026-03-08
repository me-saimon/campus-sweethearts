import { motion } from "framer-motion";
import { UserPlus, Search, MessageCircle, Heart, Mail, Infinity } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Profile",
    description: "Sign up with your university email and set up your profile with your details and preferences.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Matches",
    description: "Explore verified student profiles filtered by university, department, and interests.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Start Chatting",
    description: "Connect through our token-based chat system. Keep conversations meaningful and purposeful.",
  },
  {
    icon: Heart,
    step: "04",
    title: "Show Interest",
    description: "When you've found your match, express your interest to marry with a small fee.",
  },
  {
    icon: Mail,
    step: "05",
    title: "Guardian Approval",
    description: "An automatic email is sent to both guardians. Families stay involved from the start.",
  },
  {
    icon: Infinity,
    step: "06",
    title: "Unlimited Connection",
    description: "Once both guardians approve, enjoy unlimited chat and plan your beautiful future together!",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-peach/30 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-hero">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A simple, respectful journey from profile to proposal
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6 mb-8 last:mb-0"
            >
              <div className="flex-shrink-0 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-card">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-coral/30 to-transparent" />
                )}
              </div>
              <div className="pt-1">
                <div className="text-xs font-bold text-coral uppercase tracking-wider mb-1">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-display font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
