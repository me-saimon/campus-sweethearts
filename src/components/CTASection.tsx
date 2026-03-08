import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6 animate-heart-beat" />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Your Journey Begins Here
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto mb-8">
            Join thousands of university students who found their perfect match through UniMatch
          </p>
          <Button
            size="xl"
            className="bg-card text-foreground hover:bg-card/90 rounded-full font-bold shadow-lg"
            asChild
          >
            <Link to="/signup">
              Create Your Profile
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
