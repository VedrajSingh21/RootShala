import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { APP_ROUTES, AppRoute } from '../../config/routes';
import { CurrentUser } from '../../types';
import { canAccess } from '../../hooks/usePermissions';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  unresolvedEscalationsCount: number;
  onOpenHelpGuide?: () => void;
  currentUser: CurrentUser;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  unresolvedEscalationsCount,
  onOpenHelpGuide,
  currentUser,
  isOpen,
  onClose
}) => {
  const permittedRoutes = APP_ROUTES.filter(route => canAccess(currentUser, route.permission));

  const primaryOps = permittedRoutes.filter(r => r.section === 'primary');
  const commsAndDocs = permittedRoutes.filter(r => r.section === 'comms');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`glass-panel border-r border-slate-200/50 p-4 flex flex-col justify-between shrink-0 shadow-sm z-50 overflow-y-auto w-64 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 md:sticky md:top-0 md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer pb-2" onClick={() => onSelectModule('dashboard')}>
          <img src="/Logo.png" alt="RootShala Logo" className="h-9 object-contain" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                RootShala
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                STAFF
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">School Operations</p>
          </div>
        </div>

        {/* Core Operations Section */}
        <div>
          <div className="px-2 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Daily Operations</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>

          <nav className="space-y-1">
            {primaryOps.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-50/80 text-emerald-700 shadow-sm border border-emerald-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">
                      {item.id === 'students' && currentUser.role === 'Class Teacher' ? 'Students & Roster' : item.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration & Workflow Section */}
        {commsAndDocs.length > 0 && (
          <div>
            <div className="px-2 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Comms & AI Workflows</span>
              <Sparkles className="w-3 h-3 text-emerald-500" />
            </div>

            <nav className="space-y-1">
              {commsAndDocs.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                const count = item.id === 'needs-attention' ? unresolvedEscalationsCount : undefined;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50/80 text-emerald-700 shadow-sm border border-emerald-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {count !== undefined && count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-black rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white text-emerald-700'
                            : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

      </div>

      {/* Staff Help CTA Box */}
      <div className="pt-4 border-t-2 border-slate-100 space-y-3">
        {onOpenHelpGuide && (
          <button
            onClick={onOpenHelpGuide}
            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2"
          >
            <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="text-left">
              <div className="font-extrabold text-slate-800">New Staff?</div>
              <div className="text-[10px] text-slate-500 font-medium">Click for Easy Guide</div>
            </div>
          </button>
        )}

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>AI Assistant Ready</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
