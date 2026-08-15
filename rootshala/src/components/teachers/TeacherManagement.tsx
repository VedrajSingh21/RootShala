import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  Phone,
  AlertCircle,
  X,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherManagementProps {
  teachers: Teacher[];
  onAssignSubstitute: (absentTeacherId: string, substituteTeacherId: string, classSlot: string) => void;
  onUpdateTeacherStatus: (teacherId: string, newStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE') => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  onAssignSubstitute,
  onUpdateTeacherStatus
}) => {
  const [selectedTeacherForSub, setSelectedTeacherForSub] = useState<Teacher | null>(null);
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'ANALYTICS'>('ANALYTICS');

  const absentTeachers = teachers.filter((t) => t.status === 'ABSENT' || t.status === 'ON_LEAVE');
  const availableSubstitutes = teachers.filter((t) => t.status === 'PRESENT');
  const burnoutRiskTeachers = teachers.filter((t) => t.lecturesPerWeek >= 23);

  const handleConfirmSubstitute = () => {
    if (selectedTeacherForSub && selectedSub) {
      onAssignSubstitute(selectedTeacherForSub.id, selectedSub, `Class 10-A Period 2 ${selectedTeacherForSub.subject}`);
      setSelectedTeacherForSub(null);
      setSelectedSub('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Staffing & Faculty</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage faculty records, AI predictive staffing, and substitute assignments.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'ANALYTICS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Smart Analytics
          </button>
          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'ROSTER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Faculty Roster
          </button>
        </div>
      </div>

      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Predictive Shortage Panel */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden border border-slate-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Predictive Staffing Model</h3>
                    <p className="text-xs text-slate-400">Powered by historical attendance & seasonal trends</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upcoming Shortage</span>
                    </div>
                    <div className="text-xl font-bold">Mathematics Dept</div>
                    <p className="text-sm text-slate-400">
                      Historical data predicts a 40% spike in Math faculty absences next week due to seasonal flu trends in this region.
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <div className="text-xs text-indigo-300 font-semibold mb-1">AI Recommendation:</div>
                      <div className="text-sm">Secure 2 external substitute teachers by Friday.</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Optimal Coverage</span>
                    </div>
                    <div className="text-xl font-bold">English & Arts</div>
                    <p className="text-sm text-slate-400">
                      These departments have a 98% projected attendance rate for the next 14 days. Staffing is perfectly balanced.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Burnout Risk Heatmap Summary */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Burnout Risk</h3>
               </div>
               <p className="text-sm text-slate-600 mb-4">
                 Faculty assigned more than 22 lectures per week are at high risk of burnout based on workload analysis.
               </p>

               <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                 {burnoutRiskTeachers.map(t => (
                   <div key={t.id} className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
                     <div>
                       <div className="font-semibold text-sm text-slate-900">{t.name}</div>
                       <div className="text-xs text-slate-500">{t.subject}</div>
                     </div>
                     <div className="text-right">
                       <div className="font-bold text-orange-600 text-lg">{t.lecturesPerWeek}</div>
                       <div className="text-[10px] uppercase tracking-wider text-slate-500">Lectures/Wk</div>
                     </div>
                   </div>
                 ))}
                 {burnoutRiskTeachers.length === 0 && (
                   <div className="text-sm text-slate-500 italic">No faculty currently at risk of burnout.</div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ROSTER' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">
              Total Faculty: {teachers.length} | Absent Today: {absentTeachers.length}
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {teacher.name.charAt(teacher.name.indexOf(' ') + 1) || teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{teacher.name}</h3>
                        <div className="text-xs text-slate-500">{teacher.subject}</div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        teacher.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 my-3">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">Classes: {teacher.gradeClasses.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className={teacher.lecturesPerWeek >= 23 ? "text-orange-600 font-medium" : ""}>
                        Lectures: {teacher.lecturesPerWeek} / 25
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{teacher.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <select
                    value={teacher.status}
                    onChange={(e) => onUpdateTeacherStatus(teacher.id, e.target.value as any)}
                    className="px-2 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200 focus:outline-none"
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="ON_LEAVE">ON LEAVE</option>
                  </select>

                  {teacher.status !== 'PRESENT' && (
                    <button
                      onClick={() => setSelectedTeacherForSub(teacher)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Substitute</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Substitute Recommendation Modal */}
      {selectedTeacherForSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setSelectedTeacherForSub(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Substitute Recommender</h3>
                <p className="text-xs text-slate-400">
                  Finding coverage for {selectedTeacherForSub.name} ({selectedTeacherForSub.subject})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-900">Scheduled Lectures Today:</div>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                <li>Period 2: {selectedTeacherForSub.gradeClasses[0]} ({selectedTeacherForSub.subject})</li>
                <li>Period 4: {selectedTeacherForSub.gradeClasses[1] || selectedTeacherForSub.gradeClasses[0]} ({selectedTeacherForSub.subject})</li>
              </ul>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <label className="block text-xs font-semibold text-slate-700 sticky top-0 bg-white py-1">
                Available Faculty Matches:
              </label>

              {availableSubstitutes.map((sub) => {
                const isTopMatch = sub.secondarySubjects.includes(selectedTeacherForSub.subject) || sub.subject === selectedTeacherForSub.subject;
                return (
                  <label
                    key={sub.id}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedSub === sub.id
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="substitute"
                        value={sub.id}
                        checked={selectedSub === sub.id}
                        onChange={() => setSelectedSub(sub.id)}
                        className="text-emerald-600"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                          <span>{sub.name}</span>
                          {isTopMatch && (
                            <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Top Match
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.subject} • Workload: {sub.lecturesPerWeek}/25
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTeacherForSub(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubstitute}
                disabled={!selectedSub}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 disabled:opacity-50"
              >
                Assign Substitute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
