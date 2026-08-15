import React, { useState } from 'react';
import { Layers, Plus, Book, Users, Trash2, Edit } from 'lucide-react';
import { Teacher } from '../../types';

interface ClassesManagementProps {
  teachers: Teacher[];
}

export const ClassesManagement: React.FC<ClassesManagementProps> = ({ teachers }) => {
  const [classes, setClasses] = useState([
    { id: '1', grade: 'Grade 10', section: 'A', homeroomTeacherId: 'TCH-202', room: '101' },
    { id: '2', grade: 'Grade 10', section: 'B', homeroomTeacherId: 'TCH-205', room: '102' },
    { id: '3', grade: 'Grade 11', section: 'A', homeroomTeacherId: 'TCH-203', room: '201' },
    { id: '4', grade: 'Grade 12', section: 'Science', homeroomTeacherId: 'TCH-204', room: '301' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-600" />
            Classes & Subjects
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage school divisions, sections, and homeroom teachers.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const homeroomTeacher = teachers.find(t => t.id === cls.homeroomTeacherId);
          return (
            <div key={cls.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{cls.grade}-{cls.section}</h3>
                  <p className="text-sm text-slate-500 font-medium">Room {cls.room}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">Homeroom: 
                    <span className="font-bold text-slate-800 ml-1">{homeroomTeacher?.name || 'Unassigned'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Book className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">Curriculum: Standard State Board</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full py-2 text-emerald-600 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                  View Subjects & Timetable
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
