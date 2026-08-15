import React, { useState, useEffect } from 'react';
import { Settings, BookOpen, Receipt, Server, Save, Plus, Trash2, Building, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ref, get, set } from 'firebase/database';
import { db } from '../../lib/firebase';

type Tab = 'academic' | 'fees' | 'system';

export const SchoolAdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('academic');

  // Academic State
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [termStart, setTermStart] = useState('2026-04-01');
  const [termEnd, setTermEnd] = useState('2027-03-31');
  const [grades, setGrades] = useState([
    { id: '1', name: 'Pre-Nursery', sections: 'A, B' },
    { id: '2', name: 'Nursery', sections: 'A, B' },
    { id: '3', name: 'KG', sections: 'A, B' },
    { id: '4', name: 'Class 1', sections: 'A, B' },
    { id: '5', name: 'Class 2', sections: 'A, B' },
    { id: '6', name: 'Class 3', sections: 'A, B' },
    { id: '7', name: 'Class 4', sections: 'A, B' },
    { id: '8', name: 'Class 5', sections: 'A, B' },
    { id: '9', name: 'Class 6', sections: 'A, B' },
    { id: '10', name: 'Class 7', sections: 'A, B' },
    { id: '11', name: 'Class 8', sections: 'A, B' },
    { id: '12', name: 'Class 9', sections: 'A, B, C' },
    { id: '13', name: 'Class 10', sections: 'A, B, C' },
    { id: '14', name: 'Class 11', sections: 'Science, Commerce' },
    { id: '15', name: 'Class 12', sections: 'Science, Commerce' },
  ]);

  // Fees State
  const [baseTuition, setBaseTuition] = useState('45000');
  const [lateFee, setLateFee] = useState('50');
  const [lateFeeGraceDays, setLateFeeGraceDays] = useState('10');

  // System State
  const [schoolName, setSchoolName] = useState('RootShala International');
  const [board, setBoard] = useState('CBSE');
  const [paymentApiKey, setPaymentApiKey] = useState('rzp_live_xxxxxxxxxxx');
  const [whatsappApi, setWhatsappApi] = useState('wa_live_xxxxxxxxxxx');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snapshot = await get(ref(db, 'settings/school'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.academicYear) setAcademicYear(data.academicYear);
          if (data.termStart) setTermStart(data.termStart);
          if (data.termEnd) setTermEnd(data.termEnd);
          if (data.grades) setGrades(data.grades);
          
          if (data.baseTuition) setBaseTuition(data.baseTuition);
          if (data.lateFee) setLateFee(data.lateFee);
          if (data.lateFeeGraceDays) setLateFeeGraceDays(data.lateFeeGraceDays);
          
          if (data.schoolName) setSchoolName(data.schoolName);
          if (data.board) setBoard(data.board);
          if (data.paymentApiKey) setPaymentApiKey(data.paymentApiKey);
          if (data.whatsappApi) setWhatsappApi(data.whatsappApi);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const settingsData = {
      academicYear,
      termStart,
      termEnd,
      grades,
      baseTuition,
      lateFee,
      lateFeeGraceDays,
      schoolName,
      board,
      paymentApiKey,
      whatsappApi
    };
    
    try {
      await set(ref(db, 'settings/school'), settingsData);
      toast.success('Settings saved successfully to database!');
    } catch (error) {
      toast.error('Failed to save settings.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 premium-container space-y-6">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">School Settings & Configuration</h1>
            <p className="text-slate-500 font-medium text-sm">Manage academic structure, fee rules, and system integrations.</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="card-enterprise overflow-hidden interaction-card">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'academic' ? 'bg-white text-emerald-700 border-t-2 border-t-emerald-600 border-r border-l border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Academic Structure
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'fees' ? 'bg-white text-emerald-700 border-t-2 border-t-emerald-600 border-r border-l border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" /> Fee Configuration
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'system' ? 'bg-white text-emerald-700 border-t-2 border-t-emerald-600 border-r border-l border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" /> System & Integrations
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'academic' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CalendarIcon /> Academic Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Session Name</label>
                    <input type="text" value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Term Start Date</label>
                    <input type="date" value={termStart} onChange={e => setTermStart(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Term End Date</label>
                    <input type="date" value={termEnd} onChange={e => setTermEnd(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-slate-400" /> Classes & Sections</h3>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Grade
                  </button>
                </div>
                <div className="space-y-3">
                  {grades.map(g => (
                    <div key={g.id} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Grade Name</label>
                        <input type="text" value={g.name} onChange={() => {}} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none bg-white font-medium" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Sections (Comma separated)</label>
                        <input type="text" value={g.sections} onChange={() => {}} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none bg-white text-slate-600" />
                      </div>
                      <div className="pt-4">
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Receipt className="w-5 h-5 text-slate-400" /> General Fee Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Base Annual Tuition (₹)</label>
                    <input type="number" value={baseTuition} onChange={e => setBaseTuition(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Late Fine Amount (₹/day)</label>
                    <input type="number" value={lateFee} onChange={e => setLateFee(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grace Period (Days)</label>
                    <input type="number" value={lateFeeGraceDays} onChange={e => setLateFeeGraceDays(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Fee Auto-Generation</h4>
                    <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                      Invoices are automatically generated on the 1st of every month based on the student's grade mapping and transport distance. Late fees apply automatically after the grace period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-slate-400" /> School Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School Full Name</label>
                    <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affiliation Board</label>
                    <select value={board} onChange={e => setBoard(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50">
                      <option>CBSE</option>
                      <option>ICSE</option>
                      <option>State Board</option>
                      <option>IB / Cambridge</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-slate-400" /> API Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Gateway API Key (Razorpay)</label>
                    <input type="password" value={paymentApiKey} onChange={e => setPaymentApiKey(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Business API Key</label>
                    <input type="password" value={whatsappApi} onChange={e => setWhatsappApi(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
