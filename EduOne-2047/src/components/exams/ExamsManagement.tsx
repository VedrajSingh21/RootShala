import React, { useState } from 'react';
import { BookOpen, Search, Plus, Award, Download, Upload } from 'lucide-react';
import { Student } from '../../types';

interface ExamsManagementProps {
  students: Student[];
}

export const ExamsManagement: React.FC<ExamsManagementProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const classes = ['All', ...Array.from(new Set(students.map(s => `${s.grade}-${s.section}`)))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || `${s.grade}-${s.section}` === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-600" />
            Exams & Grading
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic performance and exam results.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:shadow-emerald-500/30 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Exam
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium min-w-[150px]"
        >
          {classes.map(c => (
            <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>
          ))}
        </select>
      </div>

      {/* Placeholder Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Midterm Math</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Midterm Science</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">
                    <div>{student.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{student.id}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{student.grade}-{student.section}</td>
                  <td className="p-4">
                    <input type="number" className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center" placeholder="--/100" />
                  </td>
                  <td className="p-4">
                    <input type="number" className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center" placeholder="--/100" />
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
                      Save
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
