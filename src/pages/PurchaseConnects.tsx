import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate, Link } from "react-router-dom";
import { ShoppingCart, Tag, Check, Send, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const packages = [
  { id: "1-connect", name: "1 Connect", credits: 1, price: 150, features: ["Unlock 1 biodata", "Access to contact information", "Connects never expire"] },
  { id: "3-connects", name: "3 Connects", credits: 3, price: 250, features: ["Unlock 3 biodatas", "Access to contact information", "Connects never expire", "Best value for money"], recommended: true },
  { id: "5-connects", name: "5 Connects", credits: 5, price: 350, features: ["Unlock 5 biodatas", "Access to contact information", "Connects never expire"] },
];

const PurchaseConnects = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useMyProfile();
  const { toast } = useToast();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [txnId, setTxnId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Navigate to="/login" />;

  const currentCredits = (profile as any)?.interest_credits || 0;

  const handleSubmit = async () => {
    if (!selectedPkg || !txnId.trim()) {
      toast({ title: "Missing info", description: "Please select a package and enter your bKash transaction ID.", variant: "destructive" });
      return;
    }
    const pkg = packages.find(p => p.id === selectedPkg);
    if (!pkg) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("connect_purchases" as any).insert({
        user_id: user!.id,
        package_name: pkg.name,
        amount: pkg.price,
        credits: pkg.credits,
        bkash_txn_id: txnId.trim(),
      } as any);
      if (error) throw error;

      toast({ title: "Purchase Submitted! ✅", description: "Your transaction has been submitted for admin approval. Credits will be added once verified." });
      setTxnId("");
      setSelectedPkg(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />

        <div className="relative">
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Button variant="ghost" size="sm" className="text-primary-foreground mb-4" asChild>
                <Link to="/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard</Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground drop-shadow-md text-center">
                Purchase <span className="text-secondary drop-shadow-sm">Connects</span>
              </h1>
              <p className="text-primary-foreground/80 text-center mt-2">Buy connects to show interest in profiles</p>
              <div className="text-center mt-3">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-1">
                  <CreditCard className="w-4 h-4 mr-1" /> Your Credits: {currentCredits}
                </Badge>
              </div>
            </motion.div>

            {/* Packages */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card
                    className={`shadow-card cursor-pointer transition-all duration-300 relative ${
                      selectedPkg === pkg.id
                        ? "ring-2 ring-primary border-primary shadow-lg scale-[1.02]"
                        : pkg.recommended
                        ? "ring-2 ring-secondary border-secondary"
                        : "border-none hover:shadow-card-hover"
                    }`}
                    onClick={() => setSelectedPkg(pkg.id)}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-secondary text-secondary-foreground shadow-md">Recommended</Badge>
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-bold">{pkg.name}</h3>
                      <p className="text-3xl font-bold font-display mt-2">
                        BDT {pkg.price}
                      </p>
                      <div className="mt-4 space-y-2">
                        {pkg.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Payment Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-card border-none max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bkash_logo.svg/1200px-Bkash_logo.svg.png" alt="bKash" className="h-6" />
                    Pay with bKash
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-rose/5 border border-rose/20">
                    <p className="text-sm font-medium mb-2">Payment Instructions:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Select a package above</li>
                      <li>Send the amount to bKash: <span className="font-bold text-foreground">01XXXXXXXXX</span></li>
                      <li>Enter the bKash Transaction ID below</li>
                      <li>Click Submit — Admin will verify and add credits</li>
                    </ol>
                  </div>

                  {selectedPkg && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                      <span className="text-sm font-medium">Selected: {packages.find(p => p.id === selectedPkg)?.name}</span>
                      <span className="font-bold text-primary">BDT {packages.find(p => p.id === selectedPkg)?.price}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>bKash Transaction ID</Label>
                    <Input
                      value={txnId}
                      onChange={e => setTxnId(e.target.value)}
                      placeholder="Enter your bKash Transaction ID"
                      maxLength={20}
                    />
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Have a Promo Code?</Label>
                      <Input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="ENTER CODE" />
                    </div>
                    <Button variant="hero" size="sm">Apply</Button>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={submitting || !selectedPkg || !txnId.trim()}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {submitting ? "Submitting..." : "Submit Purchase"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PurchaseConnects;
