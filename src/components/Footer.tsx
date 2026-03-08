import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="text-lg font-display font-bold">
              Uni<span className="text-gradient-hero">Match</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/browse" className="hover:text-primary transition-colors">Browse</Link>
            <Link to="/chat" className="hover:text-primary transition-colors">Chat</Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 UniMatch. Made with <Heart className="w-3 h-3 inline text-coral fill-current" /> for students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
