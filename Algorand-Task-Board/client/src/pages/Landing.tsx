import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Coins, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4 max-w-4xl"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
          Decentralized Micro-Task Marketplace
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
          Complete Tasks. <br/>
          <span className="text-gradient">Get Paid in Algo.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          The trustless bounty board where payments are locked in smart contracts 
          before you start working. No disputes, no delays.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)]"
            onClick={() => window.location.href = '/api/login'}
          >
            Connect with Replit
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full border-white/10 hover:bg-white/5"
          >
            Learn How It Works
          </Button>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl px-4 z-10">
        {[
          {
            icon: ShieldCheck,
            title: "Escrow Secured",
            desc: "Funds are locked in Algorand smart contracts upon task creation."
          },
          {
            icon: Zap,
            title: "Instant Settlement",
            desc: "Payments are released automatically once work is approved."
          },
          {
            icon: Coins,
            title: "Micro-Fees",
            desc: "Powered by Algorand's penny-fraction transaction costs."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-6 rounded-2xl glass-card border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
