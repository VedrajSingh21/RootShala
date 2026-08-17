import React from 'react';
import {
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Plus,
  Upload,
  Calendar,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  PhoneCall,
  Clock,
  UserPlus,
  Server, Monitor, ShieldCheck, BusFront, Library, HeartPulse, FileText, BadgeAlert, ShieldAlert, Bus, AlertTriangle, Heart
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AIActionLog, EscalationItem, CurrentUser, CollaborativeTask } from '../../types';

interface OperationsDashboardProps {
  onNavigate: (moduleId: string) => void;
  onOpenCommandCenter: (prompt?: string) => void;
  escalations: EscalationItem[];
  aiLogs: AIActionLog[];
  onOpenAddStudent: () => void;
  onOpenDocUpload: () => void;
  currentUser: CurrentUser | null;
  tasks?: CollaborativeTask[];
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  onNavigate,
  onOpenCommandCenter,
  aiLogs,
  onOpenAddStudent,
  onOpenDocUpload,
  currentUser,
  tasks = []
}) => {
  // Chart Mock Data
  const attendanceData = [
    { day: 'Mon', attendance: 96.2 },
    { day: 'Tue', attendance: 95.8 },
    { day: 'Wed', attendance: 94.1 },
    { day: 'Thu', attendance: 96.5 },
    { day: 'Fri', attendance: 93.4 },
    { day: 'Sat', attendance: 95.1 },
    { day: 'Today', attendance: 94.8 }
  ];

  const revenueData = [
    { month: 'Mar', collected: 1250, target: 1400 },
    { month: 'Apr', collected: 1820, target: 1800 },
    { month: 'May', collected: 1450, target: 1500 },
    { month: 'Jun', collected: 2100, target: 2000 },
    { month: 'Jul', collected: 2850, target: 2700 }
  ];

  const feeStatusDistribution = [
    { name: 'Paid in Full', value: 78, color: '#066157' },
    { name: 'Partial Paid', value: 14, color: '#A9D8D2' },
    { name: 'Overdue', value: 8, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentUser ? `Welcome back, ${currentUser.name}` : 'School Operations Dashboard'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            {currentUser && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md uppercase tracking-wider">
                {currentUser.role}
              </span>
            )}
            <p className="text-xs sm:text-sm text-slate-500">
              Here is your daily snapshot and quick actions.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenCommandCenter("Generate timetable")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Generate Timetable</span>
        </button>
      </div>

      {/* Metric Cards - Dynamic by Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(!currentUser || ['Super Admin', 'Principal', 'Vice Principal', 'User ID Administrator'].includes(currentUser.role)) && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Total Students</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">1,240</span><span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">+2.4% <TrendingUp className="w-3 h-3" /></span></div>
              <p className="text-[11px] text-slate-400 mt-1">Classes 8 to 12 enrolled</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Total Teachers</span><GraduationCap className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">84</span><span className="text-xs font-medium text-emerald-600">1 Absent</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Substitute suggested</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Today's Attendance</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">94.8%</span><span className="text-xs font-semibold text-emerald-600">+1.2%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Target 92.0% baseline</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Fee Collection</span><Receipt className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">₹28.5L</span><span className="text-xs font-medium text-slate-500">98% collected</span></div>
              <p className="text-[11px] text-slate-400 mt-1">₹88k pending reconciliation</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Class Teacher') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">My Class</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">42</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Enrolled students</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Class Attendance</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">98.1%</span><span className="text-xs font-medium text-emerald-600">All Present</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Today's record</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Pending Assignments</span><BookOpen className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">3</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Requires review</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Parent Meetings</span><Calendar className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">2</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Scheduled for today</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Accountant') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Today's Collection</span><Receipt className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">₹1.2L</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Across 14 transactions</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Pending Dues</span><Clock className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">₹4.5L</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Overdue by 30+ days</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Invoices Issued</span><Receipt className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">120</span></div>
              <p className="text-[11px] text-slate-400 mt-1">This term</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Reconciled Amount</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">₹27.1L</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Bank matched</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Receptionist') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Today's Visitors</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">18</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Checked in</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Enquiries Pending</span><UserPlus className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">5</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Needs follow-up</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Appointments</span><Calendar className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">8</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Scheduled for Principal</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Calls Logged</span><PhoneCall className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">45</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Handled today</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'IT Support') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Active Tickets</span><AlertTriangle className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">12</span><span className="text-xs font-medium text-emerald-600">-3</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Pending resolution</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">System Uptime</span><Server className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">99.9%</span><span className="text-xs font-medium text-emerald-600">Stable</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Last 30 days</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Smart Boards</span><Monitor className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">42/45</span></div>
              <p className="text-[11px] text-slate-400 mt-1">3 offline</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Access Requests</span><ShieldCheck className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">5</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Pending approval</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Librarian') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Total Books</span><Library className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">12,450</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Cataloged items</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Issued Today</span><BookOpen className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">45</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Across all grades</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Overdue Returns</span><Clock className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">18</span><span className="text-xs font-medium text-rose-500">Action needed</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Pending for 7+ days</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">New Arrivals</span><Plus className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">120</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Pending cataloging</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Transport Manager') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Active Routes</span><BusFront className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">18/20</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Currently operating</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Students in Transit</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">845</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Checked in</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Fleet Status</span><Bus className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">2</span><span className="text-xs font-medium text-rose-500">Maintenance</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Buses in garage</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Delays</span><Clock className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">1</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Route 4B (Traffic)</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Security Guard') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Visitors Today</span><UserPlus className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">42</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Logged at Main Gate</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Active Passes</span><BadgeAlert className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">8</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Currently on campus</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Security Alerts</span><ShieldAlert className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">0</span><span className="text-xs font-medium text-emerald-600">All Clear</span></div>
              <p className="text-[11px] text-slate-400 mt-1">No incidents reported</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Lockdown Status</span><ShieldCheck className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">Safe</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Normal operations</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Counselor') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Sessions Today</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">6</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Completed & Upcoming</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Well-being Alerts</span><HeartPulse className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">2</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Requires follow-up</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Parent Meetings</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">1</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Scheduled for this week</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Open Cases</span><Heart className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">14</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Active student monitoring</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Exam Coordinator') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Upcoming Exams</span><Calendar className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">12</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Mid-terms scheduled</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Papers Graded</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">85%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Of current cycle</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Results Pending</span><FileText className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">3</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Classes pending publication</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Invigilation Duties</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">100%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Assigned for next week</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Subject Teacher') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Lectures Today</span><BookOpen className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">5</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Across 3 grades</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Syllabus Completion</span><TrendingUp className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">62%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">On track for finals</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Assignments</span><FileText className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">28</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Pending review</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Tests Graded</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">100%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Recent unit test</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Student') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">My Attendance</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">96.5%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">This term</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Next Exam</span><Calendar className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">Physics</span></div>
              <p className="text-[11px] text-slate-400 mt-1">In 3 days</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Homework</span><BookOpen className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">2</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Due tomorrow</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Recent Grade</span><FileText className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">A-</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Math Quiz</p>
            </div>
          </>
        )}

        {(currentUser && currentUser.role === 'Parent') && (
          <>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Ward Attendance</span><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">96.5%</span></div>
              <p className="text-[11px] text-slate-400 mt-1">This term</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Fee Dues</span><Receipt className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">₹0</span><span className="text-xs font-medium text-emerald-600">Cleared</span></div>
              <p className="text-[11px] text-slate-400 mt-1">All up to date</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Next Meeting</span><Users className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">PTM</span></div>
              <p className="text-[11px] text-slate-400 mt-1">In 2 weeks</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Announcements</span><AlertTriangle className="w-4 h-4 text-slate-400" /></div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-2xl font-bold text-slate-900 tracking-tight">1</span></div>
              <p className="text-[11px] text-slate-400 mt-1">School holiday notice</p>
            </div>
          </>
        )}
      </div>

      {/* Personalized Workspace Snapshot */}
      {currentUser && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              My Daily Snapshot ({currentUser.role})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timetable Snapshot */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Today's Schedule</h3>
              {currentUser.role === 'IT Support' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">10:00 AM - Network Maintenance</span>
                    <span className="text-xs text-slate-500">Server Room</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="font-semibold text-emerald-800">02:00 PM - Smart Board Repair</span>
                    <span className="text-xs text-emerald-600">Class 9-B</span>
                  </div>
                </div>
              ) : currentUser.role === 'Librarian' ? (
                <div className="text-sm text-slate-600 py-2">
                  Morning stock checking and cataloging new arrivals.
                </div>
              ) : currentUser.role === 'Transport Manager' ? (
                <div className="text-sm text-slate-600 py-2">
                  Dispatching morning fleet and monitoring Route 4B delay.
                </div>
              ) : currentUser.role === 'Security Guard' ? (
                <div className="text-sm text-slate-600 py-2">
                  Main Gate duty and vendor entry verifications.
                </div>
              ) : currentUser.role === 'Counselor' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">11:00 AM - 1-on-1 Session</span>
                    <span className="text-xs text-slate-500">Class 10</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="font-semibold text-emerald-800">03:00 PM - Parent Meeting</span>
                    <span className="text-xs text-emerald-600">Office</span>
                  </div>
                </div>
              ) : currentUser.role === 'Exam Coordinator' ? (
                <div className="text-sm text-slate-600 py-2">
                  Finalizing seating arrangements for upcoming Mid-terms.
                </div>
              ) : currentUser.role === 'Class Teacher' || currentUser.role === 'Subject Teacher' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">08:00 AM - Physics</span>
                    <span className="text-xs text-slate-500">Class 10-A</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="font-semibold text-emerald-800">09:00 AM - Math (Substitute)</span>
                    <span className="text-xs text-emerald-600">Class 9-B</span>
                  </div>
                </div>
              ) : currentUser.role === 'Student' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">08:00 AM - Physics</span>
                    <span className="text-xs text-slate-500">Room 101</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">09:00 AM - Chemistry</span>
                    <span className="text-xs text-slate-500">Lab 2</span>
                  </div>
                </div>
              ) : currentUser.role === 'Parent' ? (
                <div className="text-sm text-slate-600 py-2">
                  No upcoming meetings. Ward is currently attending Physics.
                </div>
              ) : currentUser.role === 'Admin' || currentUser.role === 'User ID Administrator' || currentUser.role === 'Super Admin' || currentUser.role === 'Principal' || currentUser.role === 'Vice Principal' ? (
                <div className="text-sm text-slate-600 py-2">
                  No classes scheduled. Administrative duties ongoing.
                </div>
              ) : (
                <div className="text-sm text-slate-600 py-2">
                  Morning Assembly Operations & Supervision
                </div>
              )}
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Priority Tasks</h3>
              <div className="space-y-2">
                {tasks.filter(t => t.assignedRole === currentUser.role && t.status !== 'COMPLETED').map(task => (
                  <div key={task.id} className="flex items-start gap-2 text-sm p-2">
                    <input type="checkbox" className="mt-1 rounded text-emerald-600 border-slate-300" />
                    <span className="text-slate-700 font-semibold">{task.title}</span>
                    <span className="ml-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{task.priority}</span>
                  </div>
                ))}
                {tasks.filter(t => t.assignedRole === currentUser.role && t.status !== 'COMPLETED').length === 0 && (
                  <div className="text-slate-500 text-xs p-2 italic">No priority tasks assigned.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High Contrast Staff Shortcuts Launcher */}
      <div className="p-6 rounded-2xl bg-white border-2 border-slate-300 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              1-Click Staff Shortcuts (Easy Launcher)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Click any task to jump straight to the tool
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate('attendance')}
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700 transition-transform" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => onNavigate('teachers')}
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <GraduationCap className="w-5 h-5 text-emerald-700 transition-transform" />
            <span>Find Substitute</span>
          </button>

          <button
            onClick={() => onNavigate('fees')}
            className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <Receipt className="w-5 h-5 text-purple-700 transition-transform" />
            <span>Collect Fee & Receipt</span>
          </button>

          <button
            onClick={onOpenDocUpload}
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <Upload className="w-5 h-5 text-emerald-700 transition-transform" />
            <span>Scan Admission Form</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <Plus className="w-5 h-5 text-emerald-700 transition-transform" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-900 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs group"
          >
            <Calendar className="w-5 h-5 text-slate-700 transition-transform" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Clean Light Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Attendance Trend (%)</h3>
              <p className="text-xs text-slate-500">Daily student attendance vs 92% baseline</p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Avg 95.2%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#066157" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#066157" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#066157" strokeWidth={2} fillOpacity={1} fill="url(#attendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue & Fee Collection */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Fee Collection (in ₹ Thousands)</h3>
              <p className="text-xs text-slate-500">Monthly collected vs projected budget</p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              98% Rate
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="collected" fill="#066157" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Grid: Fee Status & AI Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Fee Status Breakdown</h3>
            <p className="text-xs text-slate-500">Active student ledger status</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {feeStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            {feeStatusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time AI Agent Log Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">AI Agent Workflows Log</h3>
              <button
                onClick={() => onNavigate('command-center')}
                className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>Command Center</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {aiLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{log.actionTitle}</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {log.agentName}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{log.details}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5">
                      <span>Confidence: {log.confidenceScore}%</span>
                      <span>•</span>
                      <span>{log.source}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

