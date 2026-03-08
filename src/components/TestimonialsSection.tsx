import { motion } from "framer-motion";
import { Heart, Quote, Star, Users, Gem, Sparkles, HeartHandshake } from "lucide-react";

const testimonials = [
  {
    name: "Fatima & Ahmed",
    university: "University of Dhaka",
    quote: "We matched on UniMatch during our final year. Our families loved the transparent process. Now we're happily married!",
    icon: Users,
    rating: 5,
  },
  {
    name: "Nadia & Rafiq",
    university: "BUET",
    quote: "The guardian approval feature made everything so smooth. Both families were involved from day one.",
    icon: Gem,
    rating: 5,
  },
  {
    name: "Ayesha & Imran",
    university: "Chittagong University",
    quote: "I was skeptical at first, but the verified student system gave me confidence. Found my soulmate in just 3 months!",
    icon: Sparkles,
    rating: 5,
  },
  {
    name: "Mariam & Hasan",
    university: "Jahangirnagar University",
    quote: "The token-based chat kept our conversations meaningful. It forced us to be genuine rather than just small talk.",
    emoji: "❤️",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

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
            className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Success Stories</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Love Stories That <span className="text-gradient-hero">Inspire</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real couples who found their forever on UniMatch
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
              className="relative p-6 rounded-2xl bg-background border border-border hover:shadow-card-hover hover:border-gold/30 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-coral" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-lg">
                  {testimonial.emoji}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {testimonial.name}
                    <Heart className="w-3 h-3 text-coral fill-coral" />
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
