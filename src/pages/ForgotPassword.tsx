import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Password reset email sent!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-lavender/5" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold mt-4">Forgot Password</h1>
          <p className="text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <Card className="shadow-card border-none">
          <CardContent className="p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
