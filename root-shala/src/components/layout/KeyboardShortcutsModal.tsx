import React from 'react';
import { Keyboard, X, Sparkles, Navigation, Command, ArrowRight } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (moduleId: string) => void;
  onOpenHelp: () => void;
  onOpenCommandCenter: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenHelp,
  onOpenCommandCenter
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      category: 'Quick Navigation',
      shortcuts: [
        { keys: ['Ctrl', 'Shift', 'D'], label: 'Operations Dashboard', moduleId: 'dashboard' },
        { keys: ['Ctrl', 'Shift', 'A'], label: 'Smart Attendance', moduleId: 'attendance' },
        { keys: ['Ctrl', 'Shift', 'S'], label: 'Student Directory', moduleId: 'students' },
        { keys: ['Ctrl', 'Shift', 'T'], label: 'Teachers & Substitutes', moduleId: 'teachers' },
        { keys: ['Ctrl', 'Shift', 'F'], label: 'Fee & Bank Ledger', moduleId: 'fees' },
        { keys: ['Ctrl', 'Shift', 'M'], label: 'School Timetable', moduleId: 'timetable' },
        { keys: ['Ctrl', 'Shift', 'G'], label: 'Gmail & Parent Comms', moduleId: 'gmail-inbox' },
      ]
    },
    {
      category: 'Staff Tools & AI',
      shortcuts: [
        { keys: ['Ctrl', 'Shift', 'C'], label: 'AI Command Center', action: () => onOpenCommandCenter() },
        { keys: ['Ctrl', 'Shift', 'H'], label: 'Staff Easy Help Guide', action: () => onOpenHelp() },
        { keys: ['Ctrl', 'K'], label: 'Focus Search / Dictation', action: () => onOpenCommandCenter() },
        { keys: ['Ctrl', '/'], label: 'Toggle Shortcuts Menu', action: () => onClose() },
        { keys: ['Ctrl', 'P'], label: 'Print Paper Report / Schedule', action: () => window.print() },
        { keys: ['Esc'], label: 'Close Active Popup / Dialog', action: () => onClose() },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Keyboard Navigation Shortcuts</h3>
              <p className="text-[11px] text-slate-300">Fast key combinations for school staff & administrators</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-slate-800">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-emerald-600" />
                <span>{group.category}</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {group.shortcuts.map((sc, scIdx) => (
                  <div
                    key={scIdx}
                    onClick={() => {
                      if (sc.moduleId) {
                        onNavigate(sc.moduleId);
                        onClose();
                      } else if (sc.action) {
                        sc.action();
                      }
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                      {sc.label}
                    </span>

                    <div className="flex items-center gap-1">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 text-[10px] font-extrabold font-mono bg-white text-slate-700 border-2 border-slate-300 rounded-md shadow-2xs group-hover:border-emerald-400 group-hover:text-emerald-700"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border rounded font-bold">Esc</kbd> anytime to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
