import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './components/landing/LandingPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StaffHelpModal } from './components/layout/StaffHelpModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';
import { DashboardRouter } from './components/dashboard/RoleDashboards';
import { AICommandCenter } from './components/commandCenter/AICommandCenter';
import { StudentManagement } from './components/students/StudentManagement';
import { TeacherManagement } from './components/teachers/TeacherManagement';
import { SmartAttendance } from './components/attendance/SmartAttendance';
import { SmartFeeManagement } from './components/fees/SmartFeeManagement';
import { AIDocumentCenter } from './components/documents/AIDocumentCenter';
import { AITimetable } from './components/timetable/AITimetable';
import { NeedsAttention } from './components/escalations/NeedsAttention';
import { ReportsAnalytics } from './components/analytics/ReportsAnalytics';
import { CollaborativeTaskManager } from './components/tasks/CollaborativeTaskManager';
import { GmailCommsCenter } from './components/gmail/GmailCommsCenter';
import { LoginForm } from './components/auth/LoginForm';
import { ForcePasswordReset } from './components/auth/ForcePasswordReset';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { SchoolAdminSettings } from './components/admin/SchoolAdminSettings';
import { ExamsManagement } from './components/exams/ExamsManagement';
import { ClassesManagement } from './components/classes/ClassesManagement';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { useFirebaseState } from './hooks/useFirebaseState';
import { ref, set, update, push, get } from 'firebase/database';
import { db } from './lib/firebase';
import toast from 'react-hot-toast';

import { Student, Teacher, FeeRecord, DocumentItem, TimetableSlot, EscalationItem, AIActionLog, SupplyItem, CollaborativeTask, AttendanceRecord, CurrentUser, Role } from './types';
import { canAccess, getDefaultDashboard, hasPermission } from './hooks/usePermissions';
import { APP_ROUTES } from './config/routes';
import { PERMISSIONS } from './config/rbac';
import { initializeDatabase } from './lib/db-init';

function InitDBRoute() {
  const [status, setStatus] = useState('Initializing...');
  useEffect(() => {
    initializeDatabase().then((success) => {
      setStatus(success ? 'Database populated successfully!' : 'Failed to populate database.');
    });
  }, []);
  return <div className="p-10 text-xl font-bold text-white bg-slate-900 min-h-screen">{status}</div>;
}

function CoreApplication() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Authentication State
  // As requested, we no longer persist sessions across refresh.
  const initialIsAuthenticated = false;
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialIsAuthenticated);
  const [currentRole, setCurrentRole] = useState<Role>('Super Admin');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Login Prefill State
  const [loginPrefillId, setLoginPrefillId] = useState<string | undefined>(undefined);



  // Fallback for direct role URL testing


  useEffect(() => {
    // Route Protection
    if (isAuthenticated && currentUser) {
      const currentRoute = APP_ROUTES.find(r => r.id === activeModule);
      if (!currentRoute || !canAccess(currentUser, currentRoute.permission)) {
        console.warn(`Unauthorized access attempt to ${activeModule}. Redirecting to default dashboard.`);
        setActiveModule(getDefaultDashboard(currentUser.role));
      }
    }
  }, [activeModule, isAuthenticated, currentUser]);
  const [initialCommandPrompt, setInitialCommandPrompt] = useState<string | undefined>(undefined);

  // Staff Accessibility States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [easyMode, setEasyMode] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input, textarea or contenteditable element
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      // Close modals on Escape
      if (e.key === 'Escape') {
        setIsHelpModalOpen(false);
        setIsShortcutsModalOpen(false);
        return;
      }

      // Toggle shortcuts modal on Ctrl + / or Cmd + /
      if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // Allow shortcut navigation when holding Ctrl/Cmd + Shift
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === 'd') {
          e.preventDefault();
          setActiveModule('dashboard');
        } else if (key === 'a') {
          e.preventDefault();
          setActiveModule('attendance');
        } else if (key === 's') {
          e.preventDefault();
          setActiveModule('students');
        } else if (key === 't') {
          e.preventDefault();
          setActiveModule('teachers');
        } else if (key === 'f') {
          e.preventDefault();
          setActiveModule('fees');
        } else if (key === 'm') {
          e.preventDefault();
          setActiveModule('timetable');
        } else if (key === 'g') {
          e.preventDefault();
          setActiveModule('gmail-inbox');
        } else if (key === 'c') {
          e.preventDefault();
          setActiveModule('command-center');
        } else if (key === 'h') {
          e.preventDefault();
          setIsHelpModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  // App State Store
  const students = useFirebaseState<Student>('students', []);
  const teachers = useFirebaseState<Teacher>('teachers', []);
  const fees = useFirebaseState<FeeRecord>('fees', []);
  const documents = useFirebaseState<DocumentItem>('documents', []);
  const timetable = useFirebaseState<TimetableSlot>('timetable', []);
  const escalations = useFirebaseState<EscalationItem>('escalations', []);
  const aiLogs = useFirebaseState<AIActionLog>('ai_logs', []);
  const supplyItems = useFirebaseState<SupplyItem>('supplies', []);
  const tasks = useFirebaseState<CollaborativeTask>('tasks', []);
  const attendanceRecords = useFirebaseState<AttendanceRecord>('attendance', []);

  const unresolvedEscalationsCount = escalations.filter((e) => e.status === 'UNRESOLVED').length;

  const handleOpenCommandCenter = (prompt?: string) => {
    if (prompt) {
      setInitialCommandPrompt(prompt);
    }
    setActiveModule('command-center');
  };

  // State Updates
  const handleAddStudent = async (newStudent: Student) => {
    try {
      await set(ref(db, `students/${newStudent.id}`), newStudent);
      toast.success('Student added successfully!');
    } catch (e) {
      toast.error('Failed to add student.');
    }
  };

  const handleUpdateStudent = async (studentId: string, updates: Partial<Student>) => {
    if (!canAccess(currentUser, [PERMISSIONS.STUDENTS_EDIT_ALL, PERMISSIONS.STUDENTS_EDIT_HOMEROOM])) {
      toast.error("UNAUTHORIZED: You do not have permission to modify students.");
      return;
    }
    try {
      await update(ref(db, `students/${studentId}`), updates);
      toast.success('Student updated successfully!');
    } catch (e) {
      toast.error('Failed to update student.');
    }
  };

  const handleAssignSubstitute = async (slotId: string) => {
    if (!hasPermission(currentUser, PERMISSIONS.TIMETABLE_MANAGE)) {
      toast.error("UNAUTHORIZED: You do not have permission to manage timetables.");
      return;
    }
    try {
      const slot = timetable.find(s => s.id === slotId);
      if (slot) {
        // Find a qualified, free substitute
        const occupiedTeacherIds = new Set(
          timetable.filter(s => s.day === slot.day && s.period === slot.period).map(s => s.teacherId)
        );

        const substitute = Object.values(teachers).find(t =>
          t.status !== 'ABSENT' &&
          (t.subject === slot.subject || (t.secondarySubjects || []).includes(slot.subject)) &&
          !occupiedTeacherIds.has(t.id) &&
          t.id !== slot.teacherId
        );

        if (!substitute) {
          toast.error('No free, qualified substitute available for this slot.');
          return;
        }

        await update(ref(db, `timetable/${slot.id}`), {
          teacherName: substitute.name,
          teacherId: substitute.id,
          isSubstitute: true,
          originalTeacherName: `${slot.teacherName} (On Leave)`
        });

        const newLog: AIActionLog = {
          id: `LOG-${Date.now()}`,
          agentName: 'Timetable Agent',
          actionTitle: 'Substitute Assigned',
          details: `Assigned ${substitute.name} for ${slot.subject} class coverage.`,
          confidenceScore: 98,
          reason: 'Matched subject qualification & free slot schedule.',
          source: 'Teacher Schedule Graph',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'SUCCESS'
        };
        await set(ref(db, `ai_logs/${newLog.id}`), newLog);
        toast.success(`Substitute ${substitute.name} assigned successfully.`);
      } else {
        toast.error('Timetable slot not found.');
      }
    } catch (e) {
      toast.error('Failed to assign substitute.');
    }
  };

  const handleUpdateTeacherStatus = async (teacherId: string, newStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE') => {
    if (!hasPermission(currentUser, PERMISSIONS.TEACHERS_MANAGE)) {
      toast.error("UNAUTHORIZED: You do not have permission to manage teachers.");
      return;
    }
    try {
      await update(ref(db, `teachers/${teacherId}`), { status: newStatus });
      toast.success('Teacher status updated.');
    } catch (e) {
      toast.error('Failed to update status.');
    }
  };

  const handleMarkAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    if (!hasPermission(currentUser, PERMISSIONS.ATTENDANCE_MARK_HOMEROOM)) {
      toast.error("UNAUTHORIZED: You do not have permission to mark attendance.");
      return;
    }
    try {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const today = new Date().toISOString().split('T')[0];
        const recordId = `ATT-${studentId}-${today}`;

        await update(ref(db), {
          [`attendance/${recordId}`]: {
            id: recordId,
            date: today,
            gradeClass: `${student.grade}-${student.section}`,
            studentId,
            studentName: student.name,
            status
          }
        });
        toast.success(`Attendance marked ${status}.`);
      }
    } catch (e) {
      toast.error('Failed to mark attendance.');
    }
  };

  const handleBulkMarkAttendance = async (studentIds: string[], status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    if (!hasPermission(currentUser, PERMISSIONS.ATTENDANCE_MARK_HOMEROOM)) {
      toast.error("UNAUTHORIZED: You do not have permission to mark attendance.");
      return;
    }
    try {
      const updates: Record<string, any> = {};
      const today = new Date().toISOString().split('T')[0];

      studentIds.forEach(id => {
        const student = students.find(s => s.id === id);
        if (student) {
          const recordId = `ATT-${id}-${today}`;
          updates[`attendance/${recordId}`] = {
            id: recordId,
            date: today,
            gradeClass: `${student.grade}-${student.section}`,
            studentId: id,
            studentName: student.name,
            status
          };
        }
      });

      await update(ref(db), updates);
      toast.success(`Successfully marked ${studentIds.length} students as ${status}.`);
    } catch (e) {
      toast.error('Failed to mark bulk attendance.');
    }
  };


  const handleSendParentAlert = async (studentName: string, parentPhone: string, reason: string) => {
    try {
      const newLog: AIActionLog = {
        id: `LOG-${Date.now()}`,
        agentName: 'Attendance Agent',
        actionTitle: 'Parent Notified',
        details: `Dispatched SMS/WhatsApp alert to ${parentPhone} for ${studentName} (${reason}).`,
        confidenceScore: 99,
        reason: 'Attendance dropped below threshold or consecutive absences detected.',
        source: 'Smart Attendance Matrix',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS'
      };
      await set(ref(db, `ai_logs/${newLog.id}`), newLog);
      toast.success('Parent alert sent.');
    } catch (e) {
      toast.error('Failed to send parent alert.');
    }
  };

  const handleUploadReceipt = async (fileName: string, studentName: string) => {
    if (!hasPermission(currentUser, PERMISSIONS.DOCUMENTS_UPLOAD_FEE)) {
      toast.error("UNAUTHORIZED: You do not have permission to upload fee receipts.");
      return;
    }
    try {
      const newDoc: DocumentItem = {
        id: `DOC-${Date.now()}`,
        fileName,
        type: 'FEE_RECEIPT',
        uploadedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        studentOrTeacherName: studentName,
        extractedFields: {
          studentName,
          utrCode: 'UPI/20260727/110099',
          amountPaid: '₹15,000',
          bankName: 'ICICI Bank'
        },
        confidenceScore: 96,
        status: 'APPROVED',
        fileSize: '620 KB'
      };
      await set(ref(db, `documents/${newDoc.id}`), newDoc);
      toast.success('Fee receipt uploaded.');
    } catch (e) {
      toast.error('Failed to upload receipt.');
    }
  };

  const handleResolveMismatch = async (feeId: string) => {
    if (!hasPermission(currentUser, PERMISSIONS.FEES_RECONCILE)) {
      toast.error("UNAUTHORIZED: You do not have permission to reconcile fees.");
      return;
    }
    try {
      await update(ref(db, `fees/${feeId}`), { status: 'PAID', confidenceScore: 99 });
      // Resolve the static escalation ESC-001
      await update(ref(db, `escalations/ESC-001`), { status: 'RESOLVED' });
      toast.success('Fee mismatch resolved.');
    } catch (e) {
      toast.error('Failed to resolve mismatch.');
    }
  };

  const handleSendFeeReminder = async (studentName: string) => {
    try {
      const newLog: AIActionLog = {
        id: `LOG-${Date.now()}`,
        agentName: 'Finance Agent',
        actionTitle: 'Fee Reminder Sent',
        details: `Sent payment reminder notice to parent of ${studentName}.`,
        confidenceScore: 99,
        reason: 'Pending ledger balance detected.',
        source: 'Student Fee Ledger',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS'
      };
      await set(ref(db, `ai_logs/${newLog.id}`), newLog);
      toast.success('Fee reminder sent.');
    } catch (e) {
      toast.error('Failed to send fee reminder.');
    }
  };

  const handleUploadDocument = async (doc: DocumentItem) => {
    if (!hasPermission(currentUser, PERMISSIONS.DOCUMENTS_UPLOAD_ALL)) {
      toast.error("UNAUTHORIZED: You do not have permission to upload general documents.");
      return;
    }
    try {
      await set(ref(db, `documents/${doc.id}`), doc);

      // Auto-update other modules if it's an approved Fee Receipt
      if (doc.type === 'FEE_RECEIPT' && doc.status === 'APPROVED' && doc.extractedFields.invoiceNo) {
        // Attempt to find the matching fee record
        const matchingFee = Object.values(fees).find(f => f.invoiceNo === doc.extractedFields.invoiceNo);
        if (matchingFee) {
          await update(ref(db, `fees/${matchingFee.id}`), {
            status: 'PAID',
            paidAmount: Number(doc.extractedFields.amount) || matchingFee.amount,
            paidDate: doc.extractedFields.paymentDate || new Date().toISOString().split('T')[0],
            paymentMode: doc.extractedFields.paymentMode || 'ONLINE',
            sourceDoc: doc.id
          });
          toast.success('Fee receipt uploaded and invoice marked as PAID.');
        } else {
          toast.success('Fee receipt uploaded.');
        }
      } else {
        toast.success('Document uploaded successfully.');
      }
    } catch (e) {
      toast.error('Failed to upload document.');
    }
  };

  const handleApproveDocument = async (docId: string) => {
    if (!hasPermission(currentUser, PERMISSIONS.DOCUMENTS_MANAGE_ALL)) {
      toast.error("UNAUTHORIZED: You do not have permission to approve documents.");
      return;
    }
    try {
      await update(ref(db, `documents/${docId}`), { status: 'APPROVED' });
      toast.success('Document approved.');
    } catch (e) {
      toast.error('Failed to approve document.');
    }
  };

  const handleRejectDocument = async (docId: string) => {
    if (!hasPermission(currentUser, PERMISSIONS.DOCUMENTS_MANAGE_ALL)) {
      toast.error("UNAUTHORIZED: You do not have permission to reject documents.");
      return;
    }
    try {
      await update(ref(db, `documents/${docId}`), { status: 'REJECTED' });
      toast.success('Document rejected.');
    } catch (e) {
      toast.error('Failed to reject document.');
    }
  };

  const handleGenerateTimetable = async () => {
    try {
      const res = await fetch('/api/timetable/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teachers: Object.values(teachers) })
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error, { duration: 5000 });
        return;
      }

      // Convert array to object for Firebase (array is fine too, but usually keyed by ID is better)
      const timetableObj: Record<string, TimetableSlot> = {};
      data.timetable.forEach((slot: TimetableSlot) => {
        timetableObj[slot.id] = slot;
      });

      await set(ref(db, 'timetable'), timetableObj);

      const newLog: AIActionLog = {
        id: `LOG-${Date.now()}`,
        agentName: 'Timetable Agent',
        actionTitle: 'Timetable Regenerated',
        details: `Conflict-free weekly schedule generated.`,
        confidenceScore: 99,
        reason: 'Zero room collisions & faculty workload cap respected via CSP solver.',
        source: 'Schedule Optimizer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS'
      };
      await set(ref(db, `ai_logs/${newLog.id}`), newLog);
      toast.success('Timetable regenerated successfully.');
    } catch (e) {
      toast.error('Failed to regenerate timetable.');
      console.error(e);
    }
  };

  const handleResolveEscalation = async (id: string) => {
    try {
      await update(ref(db, `escalations/${id}`), { status: 'RESOLVED' });
      toast.success('Escalation resolved.');
    } catch (e) {
      toast.error('Failed to resolve escalation.');
    }
  };

  const handleAddTask = async (newTask: CollaborativeTask) => {
    try {
      await set(ref(db, `tasks/${newTask.id}`), newTask);
      toast.success('Task added.');
    } catch (e) {
      toast.error('Failed to add task.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: CollaborativeTask['status']) => {
    try {
      await update(ref(db, `tasks/${taskId}`), { status });
      // omit toast for silent checkbox updates to reduce noise, or keep it subtle
    } catch (e) {
      toast.error('Failed to update task.');
    }
  };

  const handleExecuteSystemAction = (actionType: string, actionData?: any) => {
    if (actionType === 'TIMETABLE_GENERATE') {
      handleGenerateTimetable();
    } else if (actionType === 'ABSENT_TEACHERS') {
      toast('Please select a specific slot in the Timetable matrix to assign a substitute.', { icon: 'ℹ️' });
    } else if (actionType === 'FEE_REMINDER') {
      handleSendFeeReminder('Rohan Gupta');
    }
  };

  if (activeModule === 'landing') {
    return (
      <LandingPage
        onOpenLogin={(prefillId) => {
          setLoginPrefillId(prefillId);
          setActiveModule('login');
        }}
      />
    );
  }

  if (activeModule === 'login') {
    return (
      <LoginForm
        prefillId={loginPrefillId}
        onLogin={(user) => {
          setIsAuthenticated(true);
          setCurrentRole(user.role);
          setCurrentUser(user);
          setActiveModule(getDefaultDashboard(user.role));
        }}
      />
    );
  }

  // Catch-all route protection for any authenticated routes
  if (!isAuthenticated) {
    return (
      <LoginForm
        prefillId={loginPrefillId}
        onLogin={(user) => {
          setIsAuthenticated(true);
          setCurrentRole(user.role);
          setCurrentUser(user);
          setActiveModule(getDefaultDashboard(user.role));
        }}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-emerald-600 selection:text-white ${easyMode ? 'easy-mode' : ''} ${textSize === 'large' ? 'text-scale-large' : textSize === 'xlarge' ? 'text-scale-xlarge' : ''}`}>
      {currentUser?.mustResetPassword && (
        <ForcePasswordReset
          currentUser={currentUser}
          onSuccess={() => {
            setCurrentUser({ ...currentUser, mustResetPassword: false });
          }}
        />
      )}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        unresolvedEscalationsCount={unresolvedEscalationsCount}
        onOpenHelpGuide={() => setIsHelpModalOpen(true)}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Top Navbar (Right Side Only) */}
        <Navbar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          currentUser={currentUser}
          onLogout={() => {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
            setCurrentUser(null);
            setActiveModule('landing');
          }}
          unresolvedEscalationsCount={unresolvedEscalationsCount}
          onOpenCommandCenter={handleOpenCommandCenter}
          easyMode={easyMode}
          onToggleEasyMode={() => setEasyMode(!easyMode)}
          onOpenHelpGuide={() => setIsHelpModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6 lg:p-8 relative">
          {activeModule === 'admin-panel' && canAccess(currentUser, 'superadmin.only' as any) && (
            <SuperAdminDashboard />
          )}

          {activeModule === 'school-settings' && canAccess(currentUser, PERMISSIONS.USERS_MANAGE_ALL) && (
            <SchoolAdminSettings />
          )}

          {activeModule === 'dashboard' && (
            <DashboardRouter
              currentUser={currentUser}
              onNavigate={setActiveModule}
              onOpenCommandCenter={handleOpenCommandCenter}
              escalations={escalations}
              aiLogs={aiLogs}
              tasks={tasks}
              onOpenAddStudent={() => setActiveModule('students')}
              onOpenDocUpload={() => setActiveModule('documents')}
            />
          )}

          {activeModule === 'gmail-inbox' && (
            <GmailCommsCenter
              onAddTaskToGoogle={(title, notes) => {
                handleAddTask({
                  id: `TSK-${Date.now()}`,
                  title,
                  assignedRole: currentRole,
                  assignedTo: `${currentRole} Team`,
                  priority: 'HIGH',
                  dueDate: new Date().toISOString().split('T')[0],
                  status: 'IN_PROGRESS',
                  module: 'Gmail Comms',
                  aiSuggested: true
                });
              }}
              onOpenCommandCenter={handleOpenCommandCenter}
            />
          )}

          {activeModule === 'command-center' && (
            <AICommandCenter
              currentRole={currentRole}
              initialPrompt={initialCommandPrompt}
              aiLogs={aiLogs}
              onExecuteSystemAction={handleExecuteSystemAction}
            />
          )}

          {activeModule === 'students' && (
            <StudentManagement
              students={students}
              fees={Object.values(fees)}
              attendance={Object.values(attendanceRecords)}
              documents={Object.values(documents)}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onOpenDocOCR={(name) => {
                setActiveModule('documents');
              }}
            />
          )}

          {activeModule === 'teachers' && (
            <TeacherManagement
              teachers={teachers}
              onAssignSubstitute={handleAssignSubstitute}
              onUpdateTeacherStatus={handleUpdateTeacherStatus}
            />
          )}

          {activeModule === 'attendance' && (
            <SmartAttendance
              students={students}
              attendanceRecords={attendanceRecords}
              onMarkAttendance={handleMarkAttendance}
              onBulkMarkAttendance={handleBulkMarkAttendance}
              onSendParentAlert={(name, phone, reason) => {
                toast.success(`Alert sent to ${name}'s parent at ${phone} for ${reason}`);
              }}
            />
          )}

          {activeModule === 'fees' && (
            <SmartFeeManagement
              feeRecords={currentUser?.role === 'Class Teacher' ? fees.filter(f => {
                const currentTeacher = teachers.find(t => t.id === currentUser.id);
                return f.gradeClass === currentTeacher?.homeroomClass;
              }) : fees}
              students={students}
              onUploadReceipt={handleUploadReceipt}
              onResolveMismatch={handleResolveMismatch}
              onSendReminder={handleSendFeeReminder}
            />
          )}

          {activeModule === 'documents' && (
            <AIDocumentCenter
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onApproveDocument={handleApproveDocument}
              onRejectDocument={handleRejectDocument}
            />
          )}

          {activeModule === 'timetable' && (
            <AITimetable
              timetable={timetable}
              teachers={teachers}
              onGenerateTimetable={handleGenerateTimetable}
              onAssignSubstitute={handleAssignSubstitute}
              currentRole={currentRole}
            />
          )}

          {activeModule === 'needs-attention' && (
            <NeedsAttention
              escalations={escalations}
              onResolveEscalation={handleResolveEscalation}
              onOpenCommandCenter={handleOpenCommandCenter}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsAnalytics supplyItems={supplyItems} />
          )}

          {activeModule === 'tasks' && (
            <CollaborativeTaskManager
              tasks={tasks}
              currentRole={currentRole}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activeModule === 'exams' && (
            <ExamsManagement students={students} />
          )}

          {activeModule === 'classes' && (
            <ClassesManagement teachers={Object.values(teachers)} />
          )}

          {activeModule === 'notices' && (
            <NoticeBoard currentRole={currentRole} />
          )}
        </main>
      </div>

      {/* Interactive Staff Help & How To Guide Modal */}
      <StaffHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onNavigateToModule={setActiveModule}
        onOpenCommandCenter={handleOpenCommandCenter}
      />

      {/* Keyboard Shortcuts Navigation Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onNavigate={setActiveModule}
        onOpenHelp={() => {
          setIsShortcutsModalOpen(false);
          setIsHelpModalOpen(true);
        }}
        onOpenCommandCenter={() => {
          setIsShortcutsModalOpen(false);
          handleOpenCommandCenter();
        }}
      />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-bold',
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage onOpenLogin={() => navigate('/app')} />} />
        <Route path="/app/*" element={<CoreApplication />} />
        <Route path="/init-db" element={<InitDBRoute />} />
      </Routes>
    </>
  );
}
