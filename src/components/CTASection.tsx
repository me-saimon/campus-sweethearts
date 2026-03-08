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
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-islamic opacity-95" />
      <div className="absolute inset-0 islamic-pattern opacity-8" />

      {/* Multiple radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />

      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary-foreground/10"
          style={{
            left: `${5 + i * 6.5}%`,
            top: `${15 + (i % 4) * 20}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.05, 0.3, 0.05], scale: [1, 1.5, 1] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Floating crescents */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-16 left-[12%]"
      >
        <CrescentStar className="w-10 h-10 text-accent/20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-16 right-[12%]"
      >
        <CrescentStar className="w-7 h-7 text-accent/15" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 3 }}
        className="absolute top-1/3 right-[25%]"
      >
        <CrescentStar className="w-5 h-5 text-primary-foreground/10" />
      </motion.div>

      {/* Rotating ring decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary-foreground/[0.04]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary-foreground/[0.03]"
      />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Moon className="w-16 h-16 text-accent mx-auto mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="block"
            >
              Your Halal Journey
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="block text-accent"
            >
              Begins Here
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-primary-foreground/60 text-base italic mb-2 font-display"
          >
            "And among His signs is that He created for you mates from among yourselves"
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-primary-foreground/40 text-sm mb-12"
          >
            — Surah Ar-Rum (30:21)
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold shadow-[0_0_30px_rgba(212,175,55,0.3)] group relative overflow-hidden"
                asChild
              >
                <Link to="/signup">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Sparkles className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Create Your Profile</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
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
                className="rounded-full border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur-sm"
                asChild
              >
                <Link to="/browse">Browse Profiles</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
