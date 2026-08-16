import {
  LayoutDashboard,
  Bot,
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  FileSearch,
  CalendarDays,
  AlertTriangle,
  BarChart3,
  CheckSquare,
  Mail,
  Settings
} from 'lucide-react';
import { PERMISSIONS, Permission } from './rbac';

export type AppRoute = {
  id: string;
  title: string;
  icon: any;
  permission?: Permission | Permission[]; // Array means OR (if user has any of these)
  section: 'primary' | 'comms';
};

export const APP_ROUTES: AppRoute[] = [
  // Primary Operations
  {
    id: 'dashboard',
    title: 'Operations Dashboard',
    icon: LayoutDashboard,
    permission: [PERMISSIONS.DASHBOARD_VIEW_FULL, PERMISSIONS.DASHBOARD_VIEW_SCOPED],
    section: 'primary'
  },
  {
    id: 'attendance',
    title: 'Smart Attendance',
    icon: CalendarCheck,
    permission: [PERMISSIONS.ATTENDANCE_VIEW_ALL, PERMISSIONS.ATTENDANCE_MARK_HOMEROOM],
    section: 'primary'
  },
  {
    id: 'teachers',
    title: 'Teachers & Substitutes',
    icon: GraduationCap,
    permission: [PERMISSIONS.TEACHERS_VIEW_FULL, PERMISSIONS.TEACHERS_MANAGE],
    section: 'primary'
  },
  {
    id: 'students',
    title: 'Student Directory',
    icon: Users,
    permission: [PERMISSIONS.STUDENTS_VIEW_ALL, PERMISSIONS.STUDENTS_VIEW_HOMEROOM, PERMISSIONS.STUDENTS_VIEW_BASIC, PERMISSIONS.STUDENTS_VIEW_FEE_STATUS],
    section: 'primary'
  },
  {
    id: 'fees',
    title: 'Fee & Bank Ledger',
    icon: Receipt,
    permission: [PERMISSIONS.FEES_VIEW, PERMISSIONS.FEES_MANAGE],
    section: 'primary'
  },
  {
    id: 'timetable',
    title: 'School Timetable',
    icon: CalendarDays,
    permission: [PERMISSIONS.TIMETABLE_VIEW, PERMISSIONS.TIMETABLE_MANAGE],
    section: 'primary'
  },
  {
    id: 'exams',
    title: 'Exams & Grading',
    icon: GraduationCap,
    permission: [PERMISSIONS.DASHBOARD_VIEW_FULL, PERMISSIONS.DASHBOARD_VIEW_SCOPED],
    section: 'primary'
  },
  {
    id: 'classes',
    title: 'Classes & Subjects',
    icon: Users,
    permission: [PERMISSIONS.USERS_MANAGE_ALL],
    section: 'primary'
  },
  {
    id: 'notices',
    title: 'Notice Board',
    icon: Mail,
    permission: [PERMISSIONS.DASHBOARD_VIEW_FULL, PERMISSIONS.DASHBOARD_VIEW_SCOPED],
    section: 'primary'
  },

  // Comms & AI Workflows
  {
    id: 'gmail-inbox',
    title: 'Gmail & Parent Comms',
    icon: Mail,
    // Comms manage is a Phase 2 permission but we'll map it broadly for now if needed, or leave unassigned if not in Phase 1
    permission: PERMISSIONS.DASHBOARD_VIEW_FULL, 
    section: 'comms'
  },
  {
    id: 'documents',
    title: 'Admission OCR & Docs',
    icon: FileSearch,
    permission: [PERMISSIONS.DOCUMENTS_VIEW, PERMISSIONS.DOCUMENTS_MANAGE_ALL],
    section: 'comms'
  },
  {
    id: 'needs-attention',
    title: 'Needs Attention',
    icon: AlertTriangle,
    permission: [PERMISSIONS.OPERATIONS_VIEW_ALL], 
    section: 'comms'
  },
  {
    id: 'command-center',
    title: 'AI Command Center',
    icon: Bot,
    permission: PERMISSIONS.AI_COMMAND_CENTER,
    section: 'comms'
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart3,
    // Reports view is Phase 2, mapped to dashboard full for now
    permission: PERMISSIONS.DASHBOARD_VIEW_FULL,
    section: 'comms'
  },
  {
    id: 'tasks',
    title: 'Staff Task Board',
    icon: CheckSquare,
    permission: PERMISSIONS.DASHBOARD_VIEW_FULL,
    section: 'comms'
  },
  {
    id: 'admin-panel',
    title: 'Super Admin Panel',
    icon: Users,
    permission: 'superadmin.only' as any,
    section: 'comms'
  },
  {
    id: 'school-settings',
    title: 'School Settings',
    icon: Settings,
    permission: PERMISSIONS.USERS_MANAGE_ALL, // Restricted to Super Admin / Principal
    section: 'comms'
  }
];
