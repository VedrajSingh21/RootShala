import React, { useState } from 'react';
import { Role, CurrentUser } from '../../types';
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import {
  Bell,
  Search,
  ShieldCheck,
  Bot,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Mic,
  MicOff,
  Type,
  Printer,
  Sparkles,
  Eye,
  Keyboard,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentUser: CurrentUser;
  onLogout: () => void;
  activeModule?: string;
  onSelectModule?: (moduleId: string) => void;
  unresolvedEscalationsCount: number;
  onNavigateToModule?: (moduleId: string) => void;
  onOpenCommandCenter: (initialPrompt?: string) => void;
  easyMode: boolean;
  onToggleEasyMode: () => void;
  onOpenHelpGuide: () => void;
  onOpenShortcuts?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  activeModule,
  onSelectModule,
  unresolvedEscalationsCount,
  onNavigateToModule,
  onOpenCommandCenter,
  easyMode,
  onToggleEasyMode,
  onOpenHelpGuide,
  onOpenShortcuts,
  onToggleSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenCommandCenter(searchQuery);
      setSearchQuery('');
    }
  };

  const handleStartDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported on this browser. You can type commands directly!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        onOpenCommandCenter(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleReadAloud = async () => {
    const text = `Remix RootShala School Operations. Active role is ${currentUser.role}. You can search student files, mark attendance, or ask the AI Command Center for assistance. Click Staff Guide for step-by-step help.`;
    
    // Attempt Premium TTS API (Requires VITE_TTS_API_KEY in .env)
    const ttsApiKey = import.meta.env.VITE_TTS_API_KEY;
    if (ttsApiKey) {
      try {
        console.log("Using Premium TTS API for text:", text);
        // Example implementation:
        // const response = await fetch('https://api.tts-service.com/v1/synthesize', { ... });
        // const audioUrl = URL.createObjectURL(await response.blob());
        // new Audio(audioUrl).play();
        return;
      } catch (err) {
        console.error("Premium TTS failed, falling back to browser speech", err);
      }
    }

    // Fallback to free browser speech synthesizer
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEditName = async () => {
    const newName = window.prompt('Enter your new display name:', currentUser.name);
    if (newName && newName.trim() !== '' && newName.trim() !== currentUser.name) {
      try {
        await update(ref(db, `users/${currentUser.id}`), {
          name: newName.trim()
        });
        window.location.reload();
      } catch (e) {
        console.error('Failed to update name', e);
        alert('Failed to update name. Check console.');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/50 px-3 lg:px-6 py-2 transition-all">
      <div className="premium-container flex flex-row items-center justify-between gap-2 md:gap-3">
        
        {/* Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Staff Help Trigger */}
          <button
            onClick={onOpenHelpGuide}
            className="md:hidden px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-2xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Staff Help</span>
          </button>
        </div>

        {/* Centered Voice & Text Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md w-full mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or ask AI e.g. 'Show fee defaulters'..."
              className="w-full pl-9 pr-24 py-2 text-sm bg-slate-100 text-slate-900 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
            />
            
            {/* Dictation Voice Mic Button */}
            <button
              type="button"
              onClick={handleStartDictation}
              className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 text-[11px] font-bold ${
                isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-emerald-600 shadow-sm'
              }`}
              title="Click to speak your search or command out loud"
            >
              {isListening ? <Mic className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>
        </form>

        {/* Accessibility & Quick Staff Controls */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          

          {/* Read Aloud Page Audio Button */}
          <button
            onClick={handleReadAloud}
            className="hidden lg:flex p-2 rounded-full bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Read Page Summary Spoken Aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Print Page Button */}
          <button
            onClick={() => window.print()}
            className="hidden lg:flex p-2 rounded-full bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Print or Export Paper PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts Helper Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="hidden xl:flex px-3 py-2 rounded-full bg-transparent hover:bg-slate-100 text-slate-500 font-bold text-xs items-center gap-1.5 transition-all"
              title="Keyboard Shortcuts (Ctrl + /)"
            >
              <Keyboard className="w-4 h-4 text-slate-700" />
              <kbd className="text-[10px] font-mono bg-white px-1 py-0.5 rounded border border-slate-300">Ctrl + /</kbd>
            </button>
          )}

          {/* Staff Help & How To Use Button */}
          <button
            onClick={onOpenHelpGuide}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs items-center gap-1.5 border border-emerald-600 shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-slate-950" />
            <span>Staff Guide</span>
          </button>

          {/* AI Command Center Shortcut */}
          <button
            onClick={() => onOpenCommandCenter()}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>AI Assistant</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigateToModule('needs-attention')}
            className="relative p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Needs Attention Escalations"
          >
            <Bell className="w-4 h-4" />
            {unresolvedEscalationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {unresolvedEscalationsCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 md:border-l border-slate-200">
            <button
              onClick={handleEditName}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all text-left"
              title="Click to edit display name"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Log out securely"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
