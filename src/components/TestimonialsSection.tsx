import { motion } from "framer-motion";
import { Heart, Quote, Star, Users, Shield, Sparkles, Moon } from "lucide-react";

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

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-15" />

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
            className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-1.5 mb-6"
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
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="relative p-6 rounded-2xl bg-background border border-border hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-primary" />
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="w-4 h-4 text-accent fill-accent" />
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-islamic flex items-center justify-center">
                  <testimonial.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {testimonial.name}
                    <Heart className="w-3 h-3 text-primary fill-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">{testimonial.university}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
