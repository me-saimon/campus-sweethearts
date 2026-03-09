import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart, MessageCircle, Eye, Users, Bell, Settings,
  ChevronRight, Sparkles, Clock, CheckCircle, XCircle,
  TrendingUp, Calendar, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statsCards = [
  { label: "Profile Views", value: "128", icon: Eye, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
  { label: "Interests Received", value: "14", icon: Heart, color: "text-rose", bg: "bg-rose/10", trend: "+3" },
  { label: "Active Chats", value: "5", icon: MessageCircle, color: "text-secondary", bg: "bg-secondary/10", trend: "2 new" },
  { label: "Matches", value: "3", icon: Sparkles, color: "text-accent", bg: "bg-accent/10", trend: "+1" },
];

const recentActivity = [
  { type: "interest", message: "Ayesha Rahman showed interest in your profile", time: "2 hours ago", icon: Heart },
  { type: "view", message: "Someone from BUET viewed your profile", time: "5 hours ago", icon: Eye },
  { type: "chat", message: "New message from Fatima Noor", time: "1 day ago", icon: MessageCircle },
  { type: "match", message: "Guardian approval received for a match!", time: "2 days ago", icon: CheckCircle },
  { type: "interest", message: "Sumaiya Khan showed interest", time: "3 days ago", icon: Heart },
];

const pendingActions = [
  { label: "Respond to Ayesha's interest", status: "pending", type: "interest" },
  { label: "Complete your profile (85%)", status: "incomplete", type: "profile" },
  { label: "Verify university email", status: "pending", type: "verify" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Islamic green hero background */}
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-islamic opacity-90 h-72" />
        <div className="absolute inset-0 islamic-pattern h-72" />
        <div className="absolute inset-0 h-72 overflow-hidden">
          <div className="absolute top-6 left-12 text-secondary/30 text-3xl">☪</div>
          <div className="absolute top-10 right-16 text-secondary/20 text-2xl">☪</div>
          <div className="absolute bottom-8 right-10 text-secondary/25 text-xl">☪</div>
        </div>

      <div className="relative">
        {/* Subtle Islamic background decorations */}
        <div className="absolute inset-0 islamic-arabesque opacity-40 pointer-events-none" />
        <div className="absolute inset-0 islamic-mosque-bg pointer-events-none" />
        <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-secondary/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-teal/[0.03] blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground drop-shadow-md">
                  Welcome back, <span className="text-secondary drop-shadow-sm">Rafiq</span> 👋
                </h1>
                <p className="text-primary-foreground/80 mt-1">Here's what's happening with your profile</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                  <Link to="/profile/edit"><Settings className="w-4 h-4 mr-1" /> Edit Profile</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/browse"><Users className="w-4 h-4 mr-1" /> Browse</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 bg-card/90 backdrop-blur-sm border border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium bg-secondary/10 text-secondary">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-card border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Profile Strength
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">85% complete</span>
                      <span className="text-sm font-semibold text-primary">Good</span>
                    </div>
                    <Progress value={85} className="h-3 bg-muted" />
                  </div>
                  <div className="space-y-3">
                    {pendingActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {action.status === "incomplete" ? (
                          <XCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">{action.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link to="/profile/edit">Complete Profile <ChevronRight className="w-4 h-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-card border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === "interest" ? "bg-primary/10" :
                          item.type === "chat" ? "bg-secondary/10" :
                          item.type === "match" ? "bg-accent/10" : "bg-muted"
                        }`}>
                          <item.icon className={`w-4 h-4 ${
                            item.type === "interest" ? "text-primary" :
                            item.type === "chat" ? "text-secondary" :
                            item.type === "match" ? "text-accent" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{item.message}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Matches Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="shadow-card border-none bg-gradient-to-r from-primary/5 via-rose/5 to-lavender/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Suggested Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Ayesha R.", "Fatima N.", "Sumaiya K.", "Nusrat J."].map((name, i) => (
                    <div key={i} className="text-center group cursor-pointer">
                      <Avatar className="w-16 h-16 mx-auto mb-2 ring-2 ring-primary/20 group-hover:ring-primary transition-all">
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground font-display text-lg">
                          {name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">92% match</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="hero" size="default" asChild>
                    <Link to="/browse">View All Matches <ChevronRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
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

export default Dashboard;
