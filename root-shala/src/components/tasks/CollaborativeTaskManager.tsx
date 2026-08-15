import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  RefreshCw,
  Check,
  ArrowUpRight,
  Circle
} from 'lucide-react';
import { CollaborativeTask, Role } from '../../types';
import {
  fetchGoogleTasksList,
  createGoogleTask,
  updateGoogleTaskStatus,
  GoogleTaskItem
} from '../../lib/googleWorkspace';

interface CollaborativeTaskManagerProps {
  tasks: CollaborativeTask[];
  currentRole: Role;
  onAddTask: (task: CollaborativeTask) => void;
  onUpdateTaskStatus: (taskId: string, status: CollaborativeTask['status']) => void;
}

export const CollaborativeTaskManager: React.FC<CollaborativeTaskManagerProps> = ({
  tasks,
  currentRole,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedRole, setAssignedRole] = useState<Role>('Accountant');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [syncWithGoogle, setSyncWithGoogle] = useState(true);

  // Google Tasks State
  const [googleTasks, setGoogleTasks] = useState<GoogleTaskItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const rbacMatrix: { role: Role; permissions: string[] }[] = [
    { role: 'Super Admin', permissions: ['Full System Override', 'Final Decision Sign-Off', 'Executive Reports', 'AI Agent Tuning'] },
    { role: 'Vice Principal', permissions: ['Timetable Optimization', 'Teacher Substitutions', 'Leave Approvals', 'Class Attendance'] },
    { role: 'Accountant', permissions: ['Fee Ledger Control', 'Bank Reconciliation', 'Receipt OCR Approval', 'Reminders'] },
    { role: 'Receptionist', permissions: ['Student Admissions', 'Aadhaar Verification', 'Transfer Certificates'] },
    { role: 'IT Support', permissions: ['Supply Orders', 'Inventory Thresholds', 'Lab Equipment', 'Facility Ops'] }
  ];

  useEffect(() => {
    loadGoogleTasks();
  }, []);

  const loadGoogleTasks = async () => {
    setIsSyncing(true);
    try {
      const gTasks = await fetchGoogleTasksList();
      setGoogleTasks(gTasks);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: CollaborativeTask = {
      id: `TSK-${100 + tasks.length + 1}`,
      title: taskTitle,
      assignedRole,
      assignedTo: `${assignedRole} Team`,
      priority,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'IN_PROGRESS',
      module: 'Operations',
      aiSuggested: false
    };

    onAddTask(newTask);

    if (syncWithGoogle) {
      try {
        await createGoogleTask(taskTitle, `Assigned to ${assignedRole} Team (${priority} Priority)`);
        setSyncNotice(`Synced task "${taskTitle}" to Google Tasks API`);
        await loadGoogleTasks();
        setTimeout(() => setSyncNotice(null), 3500);
      } catch (err) {
        console.error('Failed to sync to Google Tasks:', err);
      }
    }

    setShowModal(false);
    setTaskTitle('');
  };

  // Two-Way Sync: Toggling Google Task status directly
  const handleToggleGoogleTask = async (gTask: GoogleTaskItem) => {
    const newStatus = gTask.status === 'completed' ? 'needsAction' : 'completed';
    setGoogleTasks((prev) =>
      prev.map((t) => (t.id === gTask.id ? { ...t, status: newStatus } : t))
    );

    await updateGoogleTaskStatus(gTask.id, newStatus);
    setSyncNotice(`Google Task "${gTask.title.slice(0, 25)}..." updated to ${newStatus}`);

    // Two-way sync to local app task if matched
    const matchingAppTask = tasks.find((t) =>
      t.title.toLowerCase().includes(gTask.title.toLowerCase().slice(0, 15))
    );
    if (matchingAppTask) {
      onUpdateTaskStatus(matchingAppTask.id, newStatus === 'completed' ? 'COMPLETED' : 'IN_PROGRESS');
    }

    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Two-Way Sync: Toggling app task status
  const handleAppTaskStatusChange = async (taskId: string, newStatus: CollaborativeTask['status']) => {
    onUpdateTaskStatus(taskId, newStatus);
    const appTask = tasks.find((t) => t.id === taskId);

    if (appTask) {
      const gStatus = newStatus === 'COMPLETED' ? 'completed' : 'needsAction';
      const matchingGTask = googleTasks.find((gt) =>
        gt.title.toLowerCase().includes(appTask.title.toLowerCase().slice(0, 15))
      );

      if (matchingGTask) {
        await updateGoogleTaskStatus(matchingGTask.id, gStatus);
        setGoogleTasks((prev) =>
          prev.map((t) => (t.id === matchingGTask.id ? { ...t, status: gStatus } : t))
        );
        setSyncNotice(`Two-way sync: Reflected completion in Google Tasks API`);
        setTimeout(() => setSyncNotice(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Tasks & Google Tasks Sync
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Two-Way Sync Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Collaborative task management with role-based governance and automatic two-way Google Tasks synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadGoogleTasks}
            disabled={isSyncing}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white interaction-row border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Tasks
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 interaction-btn-primary rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Google Tasks Two-Way Sync Feed Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Google Tasks Live API ({googleTasks.length} Items • Interactive 2-Way Sync)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            Google Workspace API <ArrowUpRight className="w-3 h-3 text-emerald-600" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {googleTasks.map((gt) => {
            const isCompleted = gt.status === 'completed';
            return (
              <div
                key={gt.id}
                onClick={() => handleToggleGoogleTask(gt)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200/60 opacity-75'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`font-semibold text-slate-900 block truncate ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {gt.title}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {gt.notes || 'Google Task item'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Due: {gt.due || 'Today'}</span>
                  <span className={isCompleted ? 'text-emerald-600 font-semibold' : 'text-emerald-600 font-medium'}>
                    {isCompleted ? 'Completed ✓' : 'Click to Complete'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Board Columns - Clean Minimal Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(['IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'] as const).map((status) => {
          const colTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-700 uppercase tracking-wider">
                <span>{status.replace('_', ' ')}</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-900 border border-slate-200 text-[10px] font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs interaction-card space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {t.assignedRole}
                      </span>
                      {t.aiSuggested && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-500" /> AI
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-slate-900 text-xs leading-snug">
                      {t.title}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-500">Due: {t.dueDate}</span>
                      {status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleAppTaskStatusChange(t.id, 'COMPLETED')}
                          className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          Mark Complete ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAppTaskStatusChange(t.id, 'IN_PROGRESS')}
                          className="font-medium text-slate-400 hover:text-slate-600"
                        >
                          Reopen Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-Based Access Control Matrix */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Role-Based Access Control (RBAC) Governance Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {rbacMatrix.map((r) => (
            <div
              key={r.role}
              className={`p-3.5 rounded-xl border ${
                currentRole === r.role
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>{r.role}</span>
                {currentRole === r.role && (
                  <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-extrabold">
                    ACTIVE
                  </span>
                )}
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                {r.permissions.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">Create Collaborative Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. Confirm fee receipt adjustment for Class 8"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Role Persona</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Admin">Admin</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Operations Lead">Operations Lead</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Sync directly with Google Tasks API</span>
                </div>
                <input
                  type="checkbox"
                  checked={syncWithGoogle}
                  onChange={(e) => setSyncWithGoogle(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold interaction-btn-primary"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


