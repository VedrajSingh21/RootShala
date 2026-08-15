import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  CheckCircle2,
  Users,
  GraduationCap,
  Receipt,
  CalendarDays,
  Volume2,
  Printer,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Role } from '../../types';

interface StaffHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  onNavigateToModule: (moduleId: string) => void;
  onOpenCommandCenter: (prompt?: string) => void;
}

export const StaffHelpModal: React.FC<StaffHelpModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onNavigateToModule,
  onOpenCommandCenter
}) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'roles' | 'voice_audio' | 'faq'>('quickstart');

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickTasks = [
    {
      title: 'Mark Daily Student Attendance',
      desc: 'Quickly mark Present/Absent/Late for any class and send automatic WhatsApp notifications to parents.',
      moduleId: 'attendance',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Find Substitute for Absent Teacher',
      desc: 'View absent teachers and let AI recommend available teachers qualified for that subject.',
      moduleId: 'timetable',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Collect Fee & Print Payment Receipt',
      desc: 'Verify parent UPI/Bank transfers, reconcile balances, and instantly print fee receipts.',
      moduleId: 'fees',
      icon: Receipt,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Scan Admission Form via Camera/File',
      desc: 'Upload student paper forms or photos — AI automatically fills student profiles.',
      moduleId: 'documents',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'View & Print Class Timetable',
      desc: 'Check room numbers, period schedules, and print paper schedules for staff room noticeboards.',
      moduleId: 'timetable',
      icon: CalendarDays,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border-2 border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                School Staff Easy Guide & How-To
              </h2>
              <p className="text-xs text-slate-300">
                Simple instructions created specifically for school teachers, principals, and administrative staff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText("Welcome to the School Staff Easy Guide. Choose a topic below or click any quick action button to start.")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              title="Listen to Instructions Spoken Aloud"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>🔊 Listen</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              activeTab === 'quickstart'
                ? 'bg-white border-slate-300 text-emerald-700 border-b-white -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1-Click Daily Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-white border-slate-300 text-emerald-700 border-b-white -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Switch Your Staff Persona</span>
          </button>

          <button
            onClick={() => setActiveTab('voice_audio')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              activeTab === 'voice_audio'
                ? 'bg-white border-slate-300 text-emerald-700 border-b-white -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Voice & Audio Features</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              activeTab === 'faq'
                ? 'bg-white border-slate-300 text-emerald-700 border-b-white -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Simple FAQ & Terms</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold text-sm text-emerald-950 mb-1">How can we help you today?</p>
                  <p>
                    Click any task below to navigate straight to that feature. You can also click the <strong>Voice Microphone</strong> in the top search bar to simply speak what you need!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {quickTasks.map((task, idx) => {
                  const IconComponent = task.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg border shrink-0 ${task.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onNavigateToModule(task.moduleId);
                          onClose();
                        }}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Open {task.title.split(' ')[0]} Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-medium">
                RootShala customizes your screen according to your school role. You are currently operating as <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{currentRole}</strong>.
              </p>

              <div className="space-y-3">
                {[
                  {
                    role: 'Admin' as Role,
                    title: 'School Principal / Director',
                    desc: 'Full administrative access: Approve staff leave, override fee reconciliation, inspect real-time school metrics, and sign off on AI escalations.'
                  },
                  {
                    role: 'Vice Principal' as Role,
                    title: 'Vice Principal / Academic Head',
                    desc: 'Manages class schedules, absent teachers, substitute assignments, syllabus progress, and daily teacher attendance.'
                  },
                  {
                    role: 'Accountant' as Role,
                    title: 'Chief Accountant / Cashier',
                    desc: 'Manages fee collection, UPI payment verification, bank reconciliation, pending fee reminders, and official receipt printing.'
                  },
                  {
                    role: 'Registrar' as Role,
                    title: 'School Registrar / Office Clerk',
                    desc: 'Manages student admission paperwork, OCR document extraction, parent details, transfer certificates, and cumulative registers.'
                  }
                ].map((r) => (
                  <div
                    key={r.role}
                    className={`p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-4 ${
                      currentRole === r.role
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{r.title}</span>
                        {currentRole === r.role && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-600 text-white">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectRole(r.role);
                        speakText(`Switched role to ${r.title}`);
                      }}
                      disabled={currentRole === r.role}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        currentRole === r.role
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-slate-900 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {currentRole === r.role ? 'Selected' : 'Switch To Persona'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & AUDIO */}
          {activeTab === 'voice_audio' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <span>Speech & Voice Assistance Built-In</span>
                </div>
                <p className="text-purple-950 leading-relaxed">
                  We designed RootShala so that older staff and non-tech users don't have to struggle with small keyboards or typing complex queries!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>🎙️ Voice Microphone Command</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Look for the microphone button next to the search bar at the top or in the AI Command Center. Click it and speak out loud (e.g., <em>"Show me Class 10 fee defaulters"</em> or <em>"Find math substitute"</em>).
                  </p>
                </div>

                <div className="p-4 rounded-xl border-2 border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>🔊 Read Aloud Instruction</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Click the <strong>"🔊 Listen"</strong> button on top of any module or report card to hear a spoken summary in clear English.
                  </p>
                </div>

                <div className="p-4 rounded-xl border-2 border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>🔍 Adjustable Font Size</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Use the <strong>A⁻ / A / A⁺</strong> controls on the top menu bar to make all text across the platform larger and more comfortable to read.
                  </p>
                </div>

                <div className="p-4 rounded-xl border-2 border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>🖨️ Paper Print Button</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Click <strong>"Print Report / Schedule"</strong> to automatically generate a clean, printer-friendly page for physical filing or staff room noticeboards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {[
                {
                  q: 'What is AI OCR for Admission Forms?',
                  a: 'OCR stands for Optical Character Recognition. It means when you upload a photo or PDF of a handwritten admission form, the system automatically reads the student name, date of birth, parent contact, and address so you do not have to type it manually.'
                },
                {
                  q: 'How does Substitute Suggestion work?',
                  a: 'When a teacher is marked absent, the AI scans the master timetable for qualified subject teachers who have a free class period at that exact hour, so no class remains unsupervised.'
                },
                {
                  q: 'How do parent WhatsApp & SMS reminders work?',
                  a: 'When attendance falls below 75% or fees are overdue, clicking "Send Reminder" dispatches an automated notice to the parent phone number on record.'
                },
                {
                  q: 'Can I print paper receipts and reports for physical archives?',
                  a: 'Yes! Click the "Print / Export" button located at the top right of the Fee Ledger, Timetable, and Student pages to output clean physical copies.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Remix RootShala • Made for School Administrators & Educators
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all ml-auto"
          >
            Got It! Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
