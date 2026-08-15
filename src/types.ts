export type Role = 
  | 'Super Admin'
  | 'Principal'
  | 'Vice Principal'
  | 'Class Teacher'
  | 'Subject Teacher'
  | 'Exam Coordinator'
  | 'Accountant'
  | 'Receptionist'
  | 'Librarian'
  | 'Counselor'
  | 'Transport Manager'
  | 'IT Support'
  | 'Security Guard'
  | 'Student'
  | 'Parent';

export interface CurrentUser {
  uid?: string;
  staffId?: string;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  role: Role;
  status?: string;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
  mustResetPassword?: boolean;
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  feeStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL' | 'MISMATCH';
  documentsStatus: 'VERIFIED' | 'PENDING' | 'MISSING';
  riskFlag?: string;
  avatarUrl?: string;
  rfidTag?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  secondarySubjects?: string[];
  homeroomClass?: string;
  teachingClasses?: string[];
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'SUBSTITUTE_REQUIRED';
  availability: 'Available' | 'Busy' | 'In Class';
  lecturesPerWeek: number;
  maxLecturesPerDay?: number;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  gradeClass: string;
  studentId: string;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  riskDetected?: boolean;
  riskReason?: string;
  autoScanned?: boolean;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  invoiceNo: string;
  receiptNo?: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  paymentMode?: 'ONLINE' | 'UPI' | 'BANK_TRANSFER' | 'CASH' | 'CHECK';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'MISMATCH';
  confidenceScore?: number;
  mismatchReason?: string;
  sourceDoc?: string;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  type: 'ADMISSION_FORM' | 'FEE_RECEIPT' | 'LEAVE_APPLICATION' | 'TRANSFER_CERTIFICATE' | 'SUPPLY_INVOICE';
  uploadedAt: string;
  studentOrTeacherName?: string;
  extractedFields: Record<string, any>;
  confidenceScore: number;
  confidenceScores?: Record<string, number>;
  status: 'NEEDS_REVIEW' | 'APPROVED' | 'REJECTED';
  reason?: string;
  fileSize?: string;
  source?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  timeSlot: string;
  gradeClass: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  isSubstitute?: boolean;
  originalTeacherName?: string;
}

export interface EscalationItem {
  id: string;
  title: string;
  category: 'FEE_MISMATCH' | 'OCR_REVIEW' | 'TEACHER_ABSENT' | 'MISSING_DOC' | 'PARENT_COMPLAINT' | 'SUPPLY_SHORTAGE';
  severity: Severity;
  entityName: string;
  reason: string;
  source: string;
  confidenceScore: number;
  requiresHumanApproval: boolean;
  createdAt: string;
  suggestedAction: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'IN_PROGRESS';
}

export interface AIActionLog {
  id: string;
  agentName: 'Admission Agent' | 'Finance Agent' | 'Timetable Agent' | 'Attendance Agent' | 'Operations Agent';
  actionTitle: string;
  details: string;
  confidenceScore: number;
  reason: string;
  source: string;
  timestamp: string;
  status: 'SUCCESS' | 'REQUIRES_APPROVAL' | 'EXECUTIVE_ESCALATED';
}

export interface SupplyItem {
  id: string;
  itemName: string;
  category: 'Paper & Printing' | 'Stationery' | 'Lab Equipment' | 'Sports Gear' | 'IT Hardware';
  currentStock: number;
  minThreshold: number;
  unit: string;
  monthlyBurnRate: number;
  predictedRunoutDays: number;
  status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL';
  supplier: string;
  estimatedCost: number;
}

export interface CollaborativeTask {
  id: string;
  title: string;
  assignedRole: Role;
  assignedTo: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  module: string;
  aiSuggested?: boolean;
}

export interface CommandMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionResult?: {
    type: string;
    summary: string;
    confidenceScore: number;
    reason: string;
    source: string;
    data?: any;
    requiresApproval?: boolean;
  };
}
