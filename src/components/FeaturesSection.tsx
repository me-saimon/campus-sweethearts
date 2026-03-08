import { Shield, MessageCircle, Heart, Users, CreditCard, Mail } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Verified Students",
    description: "Only verified university students can join. Your safety is our priority.",
    color: "bg-teal/10 text-teal",
  },
  {
    icon: MessageCircle,
    title: "Controlled Chat",
    description: "Chat with token limits to keep conversations meaningful and respectful.",
    color: "bg-coral/10 text-coral",
  },
  {
    icon: Heart,
    title: "Show Interest",
    description: "Found your match? Show interest and take the next step toward a beautiful future.",
    color: "bg-rose/10 text-rose",
  },
  {
    icon: Users,
    title: "Guardian Approval",
    description: "Automatic email to guardians when interest is shown. Family stays involved.",
    color: "bg-lavender/10 text-lavender",
  },
  {
    icon: Mail,
    title: "Family Notification",
    description: "Guardians receive proposal details via email for transparent communication.",
    color: "bg-gold/10 text-gold",
  },
  {
    icon: CreditCard,
    title: "Premium Proposals",
    description: "Small fee for marriage proposals ensures serious intentions only.",
    color: "bg-secondary/10 text-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral/20 to-transparent" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why <span className="text-gradient-hero">UniMatch</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built exclusively for university students who are serious about finding a life partner
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-background border border-border hover:shadow-card-hover hover:border-coral/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
