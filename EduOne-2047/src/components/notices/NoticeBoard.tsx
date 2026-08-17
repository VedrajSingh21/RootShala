import React, { useState } from 'react';
import { Bell, Megaphone, Calendar, Plus, Trash2 } from 'lucide-react';
import { Role } from '../../types';

interface NoticeBoardProps {
  currentRole: Role;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ currentRole }) => {
  const [notices, setNotices] = useState([
    { id: '1', title: 'Upcoming Quarterly Exams', content: 'The quarterly exams for grades 8-12 will begin on September 15th. Please ensure syllabus completion by Sep 5th.', date: '2026-08-25', author: 'Principal', type: 'Academic' },
    { id: '2', title: 'School Closed on Friday', content: 'Due to the upcoming state holiday, the school will remain closed this Friday. All scheduled classes are cancelled.', date: '2026-08-27', author: 'Super Admin', type: 'Holiday' },
    { id: '3', title: 'Staff Meeting at 4 PM', content: 'Mandatory staff meeting in the main hall today at 4 PM to discuss the new digital attendance policy.', date: '2026-08-30', author: 'Principal', type: 'Internal' },
  ]);

  const canManageNotices = currentRole === 'Super Admin' || currentRole === 'Principal';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-emerald-600" />
            Digital Notice Board
          </h1>
          <p className="text-slate-500 font-medium mt-1">School-wide announcements and internal staff communications.</p>
        </div>
        {canManageNotices && (
          <button 
            onClick={() => {
              const title = window.prompt("Enter notice title:");
              if (!title) return;
              const content = window.prompt("Enter notice content:");
              if (!content) return;
              const type = window.prompt("Enter notice type (Academic, Holiday, Internal):", "Internal") || "Internal";
              
              const newNotice = {
                id: Date.now().toString(),
                title,
                content,
                date: new Date().toISOString().split('T')[0],
                author: currentRole,
                type
              };
              setNotices([newNotice, ...notices]);
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post Notice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex gap-4 items-start">
            <div className={`w-2 h-full absolute left-0 top-0 ${notice.type === 'Holiday' ? 'bg-red-400' : notice.type === 'Internal' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            
            <div className="p-3 bg-slate-50 rounded-2xl text-emerald-600 shrink-0 mt-1">
              {notice.type === 'Holiday' ? <Calendar className="w-6 h-6 text-red-500" /> : <Bell className="w-6 h-6" />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800">{notice.title}</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{notice.date}</span>
              </div>
              <p className="text-slate-600 mt-2 font-medium leading-relaxed">{notice.content}</p>
              
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
                <span className="text-slate-400">Posted by <span className="text-slate-700">{notice.author}</span></span>
                <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-500">{notice.type}</span>
              </div>
            </div>
            
            {canManageNotices && (
              <button className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors absolute top-4 right-4">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
