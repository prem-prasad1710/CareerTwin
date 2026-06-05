'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, Dna, FlaskConical, TrendingUp, MessageSquare,
  Target, Zap, Shield, BarChart3, Sparkles, Brain, Clock,
} from 'lucide-react';

const FEATURES = [
  { icon: Dna, title: 'Career DNA', desc: '10-dimension radar profile of your professional fingerprint', color: 'from-indigo-500 to-purple-500' },
  { icon: FlaskConical, title: 'Career Simulator', desc: 'Simulate decisions and see salary, promotion & growth impact', color: 'from-purple-500 to-pink-500' },
  { icon: TrendingUp, title: 'Market Value', desc: 'Real-time salary estimation with 3-year forecasting', color: 'from-emerald-500 to-teal-500' },
  { icon: MessageSquare, title: 'AI Coach', desc: '7 specialized agents with full Career Twin context', color: 'from-blue-500 to-cyan-500' },
  { icon: Brain, title: 'Career Memory', desc: 'Searchable history of interviews, lessons, and milestones', color: 'from-amber-500 to-orange-500' },
  { icon: Shield, title: 'Risk Detector', desc: 'Proactive alerts for burnout, stagnation, and skill obsolescence', color: 'from-red-500 to-rose-500' },
];

const STATS = [
  { value: '15+', label: 'Prediction Engines' },
  { value: '7', label: 'AI Agents' },
  { value: '10', label: 'DNA Dimensions' },
  { value: '92%', label: 'User Satisfaction' },
];

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <FloatingOrb className="w-96 h-96 bg-indigo-600 top-20 -left-48" />
      <FloatingOrb className="w-80 h-80 bg-purple-600 top-60 right-0" delay={2} />
      <FloatingOrb className="w-64 h-64 bg-emerald-600 bottom-40 left-1/3" delay={4} />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">CareerTwin AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-muted hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/sign-in">
            <Button className="shadow-lg shadow-primary/25">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 px-8 pt-16 pb-24 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Badge variant="accent" className="mb-6 px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1 inline" /> Predictive Career Intelligence
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          Predict your future career
          <br />
          <span className="gradient-text">before it happens</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A living AI model of your professional life. Connect GitHub or Google, simulate career decisions,
          forecast salary, and get coached by AI agents that know everything about you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/sign-in">
            <Button size="lg" className="shadow-xl shadow-primary/30 px-8">
              Build Your Career Twin <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="secondary" size="lg" className="px-8">
              <Clock className="w-4 h-4" /> Try Demo Free
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass rounded-2xl p-5 cursor-default"
            >
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 mx-auto max-w-4xl"
        >
          <div className="glass gradient-border rounded-2xl p-1 glow">
            <div className="rounded-xl bg-[#0a0a12] p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="text-xs text-muted ml-2">careertwin.ai/dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Career Score', value: '78', color: 'text-indigo-400' },
                  { label: 'Market Value', value: '$155K', color: 'text-emerald-400' },
                  { label: 'Promotion Ready', value: '62%', color: 'text-purple-400' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-white/[0.03] p-4 border border-white/5">
                    <p className="text-xs text-muted">{m.label}</p>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-32 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center">
                <p className="text-sm text-muted">Live Career DNA Radar & Predictions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 px-8 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Not another resume analyzer</h2>
          <p className="text-muted max-w-xl mx-auto">
            A predictive system that continuously evolves and answers: &ldquo;What should I do next in my career?&rdquo;
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass glass-hover rounded-2xl p-6 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof / OAuth */}
      <section className="relative z-10 px-8 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center"
        >
          <p className="text-sm text-muted mb-4">Connect your existing profiles</p>
          <div className="flex justify-center gap-6">
            {['GitHub', 'Google', 'LinkedIn'].map((p) => (
              <motion.div
                key={p}
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium"
              >
                {p}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">We import repos, skills, and activity — never post on your behalf</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass gradient-border rounded-3xl p-12 md:p-16 glow"
        >
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
            <Zap className="w-10 h-10 text-primary mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your career, decoded by AI</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto text-lg">
            Join professionals who use CareerTwin weekly to make smarter career decisions.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="shadow-xl shadow-primary/30 px-10">
              Start Free — No Credit Card <BarChart3 className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center text-sm text-muted">
        <p>&copy; 2026 CareerTwin AI. Predict your future career.</p>
      </footer>
    </div>
  );
}
