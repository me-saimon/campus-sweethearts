import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26c4.56 0 8.86-1.18 12.6-3.24A22 22 0 0 1 20 30a22 22 0 0 1 24.6-21.76C41.86 5.18 37.56 4 33 4h-1z" />
    <path d="M48 14l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
);

const CTASection = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-islamic opacity-95" />
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

      {/* Animated particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary-foreground/15"
          style={{ left: `${8 + i * 9}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Floating crescents */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-16 left-[15%]"
      >
        <CrescentStar className="w-8 h-8 text-accent/30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-[15%]"
      >
        <CrescentStar className="w-6 h-6 text-accent/25" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Moon className="w-14 h-14 text-accent mx-auto mb-6 drop-shadow-lg" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-3 leading-tight">
            Your Halal Journey
            <br />
            <span className="text-accent">Begins Here</span>
          </h2>

          <p className="text-primary-foreground/70 text-base italic mb-2 font-display">
            "And among His signs is that He created for you mates from among yourselves"
          </p>
          <p className="text-primary-foreground/50 text-sm mb-10">— Surah Ar-Rum (30:21)</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold shadow-lg group"
                asChild
              >
                <Link to="/signup">
                  <Sparkles className="w-5 h-5" />
                  Create Your Profile
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/browse">Browse Profiles</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
