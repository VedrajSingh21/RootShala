import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { TimetableSlot, Teacher, Role } from '../../types';

interface AITimetableProps {
  timetable: TimetableSlot[];
  teachers: Teacher[];
  onGenerateTimetable: () => void;
  onAssignSubstitute: (slotId: string) => void;
  currentRole: Role;
}

export const AITimetable: React.FC<AITimetableProps> = ({
  timetable,
  teachers,
  onGenerateTimetable,
  onAssignSubstitute,
  currentRole
}) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const snapshot = await get(ref(db, 'settings/school/grades'));
        if (snapshot.exists()) {
          const grades = snapshot.val();
          const classList: string[] = [];
          grades.forEach((g: any) => {
            const sections = g.sections.split(',');
            sections.forEach((s: string) => {
              classList.push(`${g.name}-${s.trim()}`);
            });
          });
          setAvailableClasses(classList);
          if (classList.length > 0) setSelectedClass('ALL');
        } else {
          // Fallback to classes derived from teachers
          const fallbackClasses = new Set<string>();
          teachers.forEach(t => {
            (t.teachingClasses || []).forEach(c => fallbackClasses.add(c));
          });
          const classList = Array.from(fallbackClasses).sort();
          setAvailableClasses(classList);
          if (classList.length > 0) setSelectedClass('ALL');
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
    fetchGrades();
  }, [teachers]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const periods = [1, 2, 3, 4, 5];

  const handleRunOptimizer = () => {
    if (timetable.length > 0) {
      if (!window.confirm("A timetable already exists. Are you sure you want to overwrite it and regenerate the entire schedule?")) {
        return;
      }
    }
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateTimetable();
      setIsGenerating(false);
    }, 1200);
  };

  const getSubjectColor = (subject: string) => {
    if (subject.includes('Physics') || subject.includes('Science')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (subject.includes('Math')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (subject.includes('Chemistry')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (subject.includes('English') || subject.includes('Literature')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (subject.includes('Computer') || subject.includes('Coding')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Timetable Matrix</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly schedule matrix, room allocations, and substitute teacher assignments.
          </p>
        </div>

        {(currentRole === 'Super Admin' || currentRole === 'Principal' || currentRole === 'Class Teacher') && (
          <button
            onClick={handleRunOptimizer}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Timetable</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Controls & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDay === day
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-700 font-medium focus:outline-none"
        >
          <option value="ALL">All Classes</option>
          {availableClasses.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Calendar Grid View (Google Calendar Style) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-emerald-50 text-emerald-800">
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-4 w-24 text-emerald-800">Period</th>
                <th className="p-3.5 text-emerald-800">Subject & Class</th>
                <th className="p-3.5 text-emerald-800">Room</th>
                <th className="p-3.5 text-emerald-800">Assigned Faculty</th>
                <th className="p-3.5 text-right pr-4 text-emerald-800">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {periods.map((periodNum) => {
                const slots = timetable.filter(
                  (s) => s.day === selectedDay && s.period === periodNum && (selectedClass === 'ALL' || s.gradeClass === selectedClass)
                );

                if (slots.length === 0) {
                  return (
                    <tr key={periodNum} className="hover:bg-slate-50/50">
                      <td className="p-3.5 pl-4 font-semibold text-slate-400">Period {periodNum}</td>
                      <td colSpan={4} className="p-3.5 text-slate-400 italic">No scheduled class</td>
                    </tr>
                  );
                }

                return slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-4">
                      <div className="font-semibold text-slate-900">Period {slot.period}</div>
                      <div className="text-[10px] text-slate-400">{slot.timeSlot}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getSubjectColor(slot.subject)}`}>
                          {slot.subject}
                        </span>
                        <span className="text-slate-500 text-xs font-medium">{slot.gradeClass}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">{slot.room}</td>

                    <td className="p-3.5">
                      <div className="font-medium text-slate-900">{slot.teacherName}</div>
                      {slot.isSubstitute && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          Substitute (Replaced: {slot.originalTeacherName})
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => onAssignSubstitute(slot.id)}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

