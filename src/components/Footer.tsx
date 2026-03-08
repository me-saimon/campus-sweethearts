import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { label: "Browse Profiles", to: "/browse" },
      { label: "How It Works", to: "/#how-it-works" },
      { label: "Pricing", to: "/#pricing" },
    ],
    Account: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Edit Profile", to: "/profile/edit" },
      { label: "Chat", to: "/chat" },
    ],
    Legal: [
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Contact Us", to: "#" },
    ],
  };

  return (
    <footer className="bg-foreground relative overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V0H0V30Z" fill="hsl(var(--card))" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-display font-bold text-primary-foreground">
                Uni<span className="text-coral">Match</span>
              </span>
            </Link>
            <p className="text-primary-foreground/50 text-sm leading-relaxed mb-4">
              The trusted matrimony platform built exclusively for university students.
            </p>
            <div className="flex flex-col gap-2 text-xs text-primary-foreground/40">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>support@unimatch.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-primary-foreground/80 mb-4 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-primary-foreground/40 hover:text-coral transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/30">
            © 2026 UniMatch. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/30 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-coral fill-coral" /> for university students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
