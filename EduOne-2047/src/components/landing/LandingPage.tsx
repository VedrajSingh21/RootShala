import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  UserCheck,
  Bot,
  Lock,
  BarChart3,
  CheckCircle2,
  Building2,
  Sliders,
  ChevronRight,
  ChevronDown,
  Globe,
  KeyRound,
  FileCheck,
  MessageCircle,
  Wifi,
  Database,
  ArrowRightLeft,
  Clock,
  Smartphone,
  Briefcase,
  GraduationCap,
  BookOpen,
  PenTool,
  Monitor
} from 'lucide-react';


interface LandingPageProps {
  onOpenLogin: (prefillId?: string) => void;
}

// Simple CountUp Component
const CountUp = ({ end, duration = 2, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, end, { duration });
    }
  }, [isInView, count, end, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'finance' | 'timetable' | 'attendance'>('documents');
  const [inboxStep, setInboxStep] = useState(0);

  // Cycle inbox demo tasks
  useEffect(() => {
    const timer = setInterval(() => {
      setInboxStep(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const roleHighlights = [
    {
      role: 'Principal',
      user: 'Principal (EMP-902)',
      badge: 'Executive Leadership',
      focus: 'High-level institutional efficiency metrics, strategic policy decisions, faculty workload health, financial status, and executive directive broadcasts.'
    },
    {
      role: 'Accountant',
      user: 'Michael Chang (ACT-511)',
      badge: 'Finance & Administration',
      focus: 'Real-time fee collection status, OCR-powered receipt verification, revenue anomaly detection, and automated mismatch escalations.'
    },
    {
      role: 'Receptionist',
      user: 'Sarah Connor (REC-114)',
      badge: 'Front Desk Operations',
      focus: 'Instant visitor logging, secure document uploads, quick student lookups, and basic inquiry routing.'
    },
    {
      role: 'Class Teacher',
      user: 'Elena Rostova (TCH-202)',
      badge: 'Faculty & Support Operations',
      focus: 'Personal class schedules, quick attendance taking, student roster lookups, collaborative tasks management, and leave requests.'
    }
  ];

  const inboxTasks = [
    { type: 'Attendance', title: 'Teacher Absent (Class 10 Math)', action: 'Approve Substitute: Mr. Sharma', icon: AlertTriangle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { type: 'Finance', title: 'Fee Mismatch: Term 2 Tuition', action: 'Verify Payment Receipt', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { type: 'Documents', title: 'OCR Confidence Low: Transfer Cert', action: 'Review Highlighted Fields', icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-100' }
  ];

  const complianceBadges = [
    "CBSE-Ready", 
    "ICSE-Ready", 
    "State Board Compatible", 
    "DPDP Act–Conscious"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden relative pt-16">
      {/* Top Header Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-[14px] border-b border-[#DCE9E6] h-[72px] transition-all shadow-sm flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 xl:px-[64px] flex items-center justify-between">
          
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/Logo.png" alt="RootShala Logo" className="h-9 object-contain drop-shadow-sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">RootShala</span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">Autonomous School Operating System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#how-it-works" className="text-sm font-semibold text-[#0F172A] hover:text-[#055248] transition-colors py-4">How It Works</a>
            <a href="#capabilities" className="text-sm font-semibold text-[#0F172A] hover:text-[#055248] transition-colors py-4">Capabilities</a>
            <a href="#for-schools" className="text-sm font-semibold text-[#0F172A] hover:text-[#055248] transition-colors py-4">For Schools</a>
            <a href="#security" className="text-sm font-semibold text-[#0F172A] hover:text-[#055248] transition-colors py-4">Security</a>
            <a href="#demo" className="text-sm font-semibold text-[#0F172A] hover:text-[#055248] transition-colors py-4">Demo</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLogin()}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 text-white bg-[#066157] hover:bg-[#055248] shadow-[0_12px_30px_rgba(6,97,87,0.18)] transition-all"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative pt-24 pb-20 px-4 sm:px-8 premium-container w-full text-center z-10">
        {/* Live Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl mx-4 sm:mx-0">
          <div className="absolute inset-0 opacity-40 animate-gradient-x bg-[linear-gradient(180deg,#F8FBFA_0%,#F3F8F7_100%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,97,87,0.08)_0%,transparent_70%)] backdrop-blur-[2px]"></div>
          
          {/* Floating Educational Icons */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
            className="absolute top-10 left-10 md:left-24 text-emerald-500/10"
          >
            <BookOpen className="w-20 h-20 md:w-32 md:h-32 drop-shadow-md" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 40, 0], rotate: [0, -15, 10, 0] }}
            transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            className="absolute bottom-10 right-10 md:right-24 text-emerald-500/10"
          >
            <Monitor className="w-24 h-24 md:w-36 md:h-36 drop-shadow-md" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -25, 0], x: [0, 20, 0], rotate: [0, 20, -5, 0] }}
            transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, delay: 2 }}
            className="absolute top-20 right-1/4 text-emerald-500/10 hidden sm:block"
          >
            <PenTool className="w-20 h-20 drop-shadow-md" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 35, 0], x: [0, -25, 0], rotate: [0, -20, 15, 0] }}
            transition={{ duration: 14, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-20 left-1/4 text-emerald-500/10 hidden sm:block"
          >
            <GraduationCap className="w-24 h-24 drop-shadow-md" />
          </motion.div>
        </div>



        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} className="flex flex-col items-center">

          <h1 className="text-[clamp(3rem,5vw,5.5rem)] font-black tracking-tight text-slate-900 leading-tight max-w-[900px] mx-auto">
            Autonomous School Operations <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#066157] via-[#0B8A7A] to-[#159A8C]">
              Powered by Specialized AI & Role Control
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            RootShala automates fee reconciliation, timetable substitutions, and document processing — while keeping principals and admin staff in full control of every decision involving money, discipline, or student safety.
          </p>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <motion.button
              variants={fadeUpVariant}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenLogin()}
              className="w-full sm:w-auto px-8 py-4 text-sm rounded-2xl flex items-center justify-center gap-2 btn-primary"
            >
              <Bot className="w-4 h-4" />
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.a
              variants={fadeUpVariant}
              whileTap={{ scale: 0.95 }}
              href="#capabilities"
              className="w-full sm:w-auto px-8 py-4 text-sm rounded-2xl text-center btn-secondary"
            >
              Explore Features
            </motion.a>
          </motion.div>

          {/* Looping Hero Animation */}
          <div className="mt-16 w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative h-28 flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              {inboxStep % 2 === 0 ? (
                <motion.div
                  key="task"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-bold text-slate-900">Teacher Absent</div>
                    <div className="text-xs text-slate-500">Class 10 Math — Mr. Davis</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-bold text-slate-900">Substitute Assigned ✓</div>
                    <div className="text-xs text-emerald-600 font-medium">Mrs. Sharma notified via App</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* INFINITE SCROLLING BADGE STRIP */}
      <div className="w-full bg-white border-y border-slate-200 overflow-hidden py-4 flex group">
        <motion.div 
          className="flex items-center whitespace-nowrap min-w-max shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {/* Duplicate the array to create a seamless infinite scroll loop */}
          {[...complianceBadges, ...complianceBadges, ...complianceBadges, ...complianceBadges].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-8">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{badge}</span>
              <span className="text-slate-300 mx-6">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* SECTION 2 — COMPARISON */}
      <section className="py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="premium-container">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900">The Operations Evolution</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUpVariant}
              className="bg-slate-50 rounded-3xl p-8 border border-slate-200"
            >
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Traditional ERP</div>
              <div className="flex items-center gap-4 text-xl font-medium text-slate-400">
                <Database className="w-6 h-6" />
                Store Data
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUpVariant}
              className="bg-emerald-600 rounded-3xl p-8 shadow-xl shadow-emerald-600/20 text-white"
            >
              <div className="text-sm font-bold text-emerald-200 uppercase tracking-wider mb-6">RootShala</div>
              <motion.div variants={staggerContainer} className="flex flex-wrap items-center gap-2 text-xl font-bold">
                {['Read', '→', 'Understand', '→', 'Decide', '→', 'Automate', '→', 'Notify'].map((word, i) => (
                  <motion.span 
                    key={i}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                    }}
                    className={word === '→' ? 'text-emerald-300 mx-1' : ''}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="premium-container sm:px-8">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-3xl font-bold text-center text-slate-900 mb-16"
          >
            How Autonomous Operations Work
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="space-y-6">
            {[
              { title: 'Upload a Document', icon: FileText, desc: 'Receipts, applications, or certificates.' },
              { title: 'AI Extracts Fields', icon: Sparkles, desc: 'Contextual understanding of unstructured text.' },
              { title: 'Confidence Checked', icon: ShieldCheck, desc: 'Flags anything ambiguous for human review.' },
              { title: 'Human Confirms, Data Syncs Everywhere', icon: UserCheck, desc: 'No blind automated actions on sensitive data.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                variants={scaleUpVariant}
                className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — LIVE DEMO PREVIEW */}
      <section className="py-24 bg-white border-y border-slate-200 overflow-hidden">
        <div className="premium-container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The "Needs Attention" Inbox</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Instead of digging through dashboards to find problems, RootShala brings the problems to you. The platform autonomously identifies fee mismatches, absent teachers, and low-confidence OCR scans, presenting them as actionable cards.
            </p>
            {/* // TODO: add once we have a real pilot - real product demo video loop replacing the right side */}
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-inner"
          >
            <div className="space-y-4">
              {inboxTasks.map((task, i) => (
                <div 
                  key={i} 
                  className={`p-5 card-enterprise border ${i === inboxStep ? 'border-emerald-300 shadow-lg' : 'border-slate-200 shadow-sm opacity-60'} transition-all duration-300 flex items-start gap-4 cursor-default`}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-full ${task.bg} ${task.color} flex items-center justify-center`}>
                    <task.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{task.type}</div>
                    <div className="font-bold text-slate-900 text-base">{task.title}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 font-semibold text-sm rounded-lg hover:bg-emerald-100 transition-colors">
                        {task.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — FEE RECONCILIATION SPOTLIGHT */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-slate-900 to-slate-900"></div>
        <div className="premium-container relative z-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-slate-300 mb-8">Manual Fee Reconciliation Time</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-black text-red-500 line-through decoration-red-600/50 mb-2">
                <CountUp end={3} duration={1.5} />-<CountUp end={4} duration={2} /> days/month
              </div>
              <div className="text-red-400 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> Spreadsheets & Chasing Slips
              </div>
            </motion.div>

            <ArrowRightLeft className="w-8 h-8 text-slate-600 hidden md:block" />

            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-6xl font-black text-emerald-400 mb-2">Instant</div>
              <div className="text-slate-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Automated Ledger Matching
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CAPABILITIES */}
      <section id="capabilities" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="premium-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Core Capabilities</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['documents', 'finance', 'timetable', 'attendance'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-8 border border-slate-200 min-h-[250px] relative shadow-sm">
            <AnimatePresence mode="wait">
              {activeTab === 'documents' && (
                <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><FileText className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Intelligent Document Processing</h3>
                  <p className="text-slate-600 text-lg">Upload physical forms, certificates, or receipts. The system extracts exact data points automatically, routing low-confidence reads to human staff for final verification.</p>
                </motion.div>
              )}
              {activeTab === 'finance' && (
                <motion.div key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><CreditCard className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Automated Fee Ledger</h3>
                  <p className="text-slate-600 text-lg">Every transaction is logged and mapped to the student's unique ledger. Mismatches in expected vs. received amounts are instantly flagged for accountant review.</p>
                </motion.div>
              )}
              {activeTab === 'timetable' && (
                <motion.div key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Calendar className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Dynamic Timetable & Substitutions</h3>
                  <p className="text-slate-600 text-lg">Create robust class schedules without conflicts. When a teacher marks absent, the AI substitute recommendation engine immediately finds the best available replacement staff.</p>
                </motion.div>
              )}
              {activeTab === 'attendance' && (
                <motion.div key="att" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Users className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Attendance Matrix</h3>
                  <p className="text-slate-600 text-lg">One-tap morning roll call for teachers. The system automatically identifies chronic absenteeism patterns and prepares parent communication drafts.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* NEW SECTION 6.5 — ALTERNATING PERSONA PANELS */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="premium-container space-y-24">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">What Changes for You</h2>
          </div>

          {[
            {
              role: 'For Principals',
              headline: 'Total operational oversight without the spreadsheet fatigue.',
              icon: Briefcase,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              reverse: false
            },
            {
              role: 'For Accounts Staff',
              headline: 'End-of-day ledger reconciliation drops from hours to instant.',
              icon: CreditCard,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              reverse: true
            },
            {
              role: 'For Teachers',
              headline: 'Less time chasing attendance sheets, more time teaching.',
              icon: GraduationCap,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              reverse: false
            },
            {
              role: 'For Parents',
              headline: 'Immediate WhatsApp updates on fees and daily attendance.',
              icon: Smartphone,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              reverse: true
            }
          ].map((persona, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col md:flex-row items-center gap-12 ${persona.reverse ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex-1 w-full aspect-video rounded-3xl ${persona.bg} border border-slate-100 flex items-center justify-center shadow-inner`}>
                <persona.icon className={`w-24 h-24 ${persona.color} opacity-80`} />
              </div>
              <div className="flex-1 space-y-4">
                <div className={`text-sm font-bold uppercase tracking-widest ${persona.color}`}>
                  {persona.role}
                </div>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">
                  {persona.headline}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — BUILT FOR INDIAN SCHOOLS */}
      <section id="for-schools" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="premium-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Built for Indian Schools</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Engineered specifically for the realities of Indian education ecosystems.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <Building2 className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Multi-Board Support</h3>
              <p className="text-sm text-slate-600">Native structures mapping exactly to CBSE, ICSE, and State Board academic formatting requirements.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <CreditCard className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Indian Fee Structures</h3>
              <p className="text-sm text-slate-600">Complex handling built-in: tuition + transport + sibling discounts + late fines modeled in a real ledger format.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <MessageCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">WhatsApp-First Comm</h3>
              <p className="text-sm text-slate-600">Parent notifications default to WhatsApp, ensuring read-receipts and immediate visibility over standard email.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <Users className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">RTE Quota Tracking</h3>
              <p className="text-sm text-slate-600">Automated flagging for RTE students and scholarship-eligibility to ensure compliance without manual spreadsheets.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <Globe className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Vernacular Support</h3>
              <p className="text-sm text-slate-600">Core communication templates support Hindi and regional vernacular languages for parent inclusion.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="p-6 card-enterprise transition-all">
              <Wifi className="w-8 h-8 text-slate-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Tier 2/3 Connectivity</h3>
              <p className="text-sm text-slate-600">Lightweight payloads and optimistic UI updates ensure the app remains responsive on patchy 4G connections.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 — SANDBOX CTA */}
      <section id="demo" className="py-24 bg-white border-t border-slate-200 scroll-mt-20">
        <div className="premium-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Try the Live Demo (Sandbox Data)</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleHighlights.map((role, i) => (
              <motion.div 
                key={i} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-slate-50 border border-slate-200 rounded-[20px] p-6 flex flex-col transition-all duration-200 group"
              >
                <div className="mb-4">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">
                    {role.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{role.role}</h3>
                <div className="text-sm text-slate-500 font-mono mb-4">{role.user}</div>
                <p className="text-sm text-slate-600 mb-6 flex-1">{role.focus}</p>
                <button 
                  onClick={() => onOpenLogin(role.user.split('(')[1].replace(')',''))}
                  className="w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors"
                >
                  Login as {role.role}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — TRUST & SECURITY */}
      <section id="security" className="py-24 bg-slate-900 text-white scroll-mt-20">
        <div className="premium-container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-12">Trust & Security by Design</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            <motion.div variants={scaleUpVariant}>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Human-in-the-Loop</h3>
              <p className="text-slate-400 text-sm">Every AI decision touching money, discipline, or student safety requires explicit human review. The AI proposes; your staff decides.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant}>
              <h3 className="text-xl font-bold text-slate-200 mb-3">DPDP Act Conscious</h3>
              <p className="text-slate-400 text-sm">Data handling architecture designed with modern privacy regulations in mind, ensuring student data remains fiercely protected.</p>
            </motion.div>

            <motion.div variants={scaleUpVariant}>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Strictly Siloed Data</h3>
              <p className="text-slate-400 text-sm">Zero cross-school data pooling without explicit consent. Your school's data trains only your school's operational engine.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 
        // DO NOT ADD TESTIMONIALS OR LOGO WALL YET
        // add once we have a real pilot - real testimonials, real metrics, real logo walls
      */}

      {/* SECTION 10 — FINAL CTA & FOOTER */}
      <footer className="py-24 bg-slate-50 border-t border-slate-200 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to Automate Your School?</h2>
          <button
            onClick={() => onOpenLogin()}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 mx-auto mb-16"
          >
            <Bot className="w-4 h-4" />
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-12 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Database className="w-4 h-4" /> Powered by Firebase Firestore
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Sparkles className="w-4 h-4" /> Intelligence by Gemini AI
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};
