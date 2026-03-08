import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, Quote, Star, Users, Shield, Sparkles, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Fatima & Ahmed",
    university: "University of Dhaka",
    quote: "We matched on UniMatch during our final year. The halal process gave both our families peace of mind. Alhamdulillah, we're happily married!",
    icon: Users,
    rating: 5,
  },
  {
    name: "Nadia & Rafiq",
    university: "BUET",
    quote: "The guardian approval feature ensured our families were involved from the start — exactly how it should be in Islam.",
    icon: Shield,
    rating: 5,
  },
  {
    name: "Ayesha & Imran",
    university: "Chittagong University",
    quote: "I was skeptical at first, but the verified student system gave me confidence. Found my naseeb in just 3 months, MashaAllah!",
    icon: Sparkles,
    rating: 5,
  },
  {
    name: "Mariam & Hasan",
    university: "Jahangirnagar University",
    quote: "The respectful chat system kept our conversations purposeful and within boundaries. It felt truly halal throughout.",
    icon: Moon,
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.3, type: "spring" } }}
      className="relative p-7 rounded-2xl bg-background border border-border hover:shadow-hover hover:border-accent/30 transition-all duration-500 group overflow-hidden"
    >
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </div>

      <div className="absolute top-4 right-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
          className="opacity-8 group-hover:opacity-20 transition-opacity"
        >
          <Quote className="w-12 h-12 text-primary" />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 200 }}
            >
              <Star className="w-4 h-4 text-accent fill-accent" />
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
          "{testimonial.quote}"
        </p>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-11 h-11 rounded-full bg-gradient-islamic flex items-center justify-center relative"
          >
            <testimonial.icon className="w-5 h-5 text-primary-foreground" />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              {testimonial.name}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-3 h-3 text-primary fill-primary" />
              </motion.div>
            </div>
            <div className="text-xs text-muted-foreground">{testimonial.university}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      {/* Animated decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full border border-accent/5"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-30 -right-30 w-60 h-60 rounded-full border border-primary/5"
      />

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
            className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-5 py-2 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Success Stories</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Blessed Unions That <span className="text-gradient-hero">Inspire</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real couples who found their naseeb on UniMatch — Alhamdulillah
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Social proof counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 shadow-card">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  className="w-8 h-8 rounded-full bg-gradient-islamic border-2 border-card flex items-center justify-center"
                >
                  <Heart className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">500+</span> couples matched
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
