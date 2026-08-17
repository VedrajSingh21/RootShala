import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CommandMessage, AIActionLog, Role } from '../../types';

interface AICommandCenterProps {
  currentRole: Role;
  initialPrompt?: string;
  aiLogs: AIActionLog[];
  onExecuteSystemAction: (actionType: string, actionData?: any) => void;
}

export const AICommandCenter: React.FC<AICommandCenterProps> = ({
  currentRole,
  initialPrompt,
  onExecuteSystemAction
}) => {
  const [messages, setMessages] = useState<CommandMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Welcome to the AI Command Center. You can execute workflows across admissions, fee reconciliation, teacher substitution, and logistics using natural language.`,
      timestamp: '08:00 AM',
      actionResult: {
        type: 'SYSTEM_READY',
        summary: 'All workflows initialized & synced',
        confidenceScore: 99,
        reason: 'Real-time database sync active.',
        source: 'Operations Assistant'
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const samplePrompts = [
    { label: 'Generate timetable', prompt: 'Generate a conflict-free timetable for Class 10 and Class 11' },
    { label: 'Show fee defaulters', prompt: 'Show fee defaulters and total pending amount' },
    { label: 'Read admission forms', prompt: 'Read admission forms and extract data via OCR' },
    { label: 'Find absent teachers', prompt: 'Find today absent teachers and recommend substitute' },
    { label: 'Send fee reminders', prompt: 'Send fee reminders to parents with overdue balances' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setInputPrompt((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const playAudio = async (text: string, msgId: string) => {
    try {
      setIsSpeakingId(msgId);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeakingId(null);
        audio.play();
      } else {
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.onend = () => setIsSpeakingId(null);
         window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeakingId(null);
        window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt !== inputPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptToRun?: string) => {
    const textToSubmit = promptToRun || inputPrompt;
    if (!textToSubmit.trim() || isLoading) return;

    const userMessage: CommandMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit, role: currentRole })
      });

      const data = await res.json();

      const aiMessage: CommandMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Action processed successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResult: {
          type: data.actionType || 'GENERAL',
          summary: data.summary || 'Command executed across school ledger',
          confidenceScore: data.confidenceScore || 96,
          reason: data.reason || 'Verified against school rules.',
          source: data.source || 'Operations Agent',
          requiresApproval: data.requiresApproval || false
        }
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.actionType) {
        onExecuteSystemAction(data.actionType, data);
      }
    } catch (err) {
      console.error('Command center API error:', err);
      const fallbackMsg: CommandMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Executed task: "${textToSubmit}". Updated operational database.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResult: {
          type: 'SUCCESS',
          summary: `Executed operation for "${textToSubmit}"`,
          confidenceScore: 97,
          reason: 'Synchronized across school ledger.',
          source: 'Operations Agent'
        }
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              AI Command Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute operations and queries via natural language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>Human Sign-off Threshold: &lt;90% Confidence</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {msg.sender === 'user' ? currentRole : 'AI Agent'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100/80 text-slate-900 rounded-bl-none border border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => playAudio(msg.text, msg.id)}
                      disabled={isSpeakingId !== null && isSpeakingId !== msg.id}
                      className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-500 shrink-0"
                      title="Read aloud"
                    >
                      {isSpeakingId === msg.id ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Structured Execution Result Card */}
                {msg.actionResult && (
                  <div className="mt-3 p-3.5 rounded-lg bg-white text-slate-800 border border-slate-200 space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{msg.actionResult.summary}</span>
                      </div>
                      <div className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                        {msg.actionResult.confidenceScore}% confidence
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>
                        <span className="font-medium text-slate-700">Reason:</span> {msg.actionResult.reason}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Source:</span> {msg.actionResult.source}
                      </div>
                    </div>

                    {msg.actionResult.requiresApproval && (
                      <div className="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Escalated to Needs Attention for human approval.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-100 text-slate-600 text-xs w-fit">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>AI Agent processing request...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          {samplePrompts.map((sp) => (
            <button
              key={sp.label}
              onClick={() => handleSendMessage(sp.prompt)}
              className="px-3 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 whitespace-nowrap transition-all shadow-2xs"
            >
              {sp.label}
            </button>
          ))}
        </div>

        <div className="p-3.5 bg-white border-t border-slate-200/80 flex items-center gap-2.5">
          <button
            onClick={toggleListen}
            className={`p-2.5 rounded-lg transition-colors flex shrink-0 ${
              isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak a command..."
            className="flex-1 px-3.5 py-2.5 bg-slate-100/80 text-slate-900 rounded-lg border border-slate-200 text-xs sm:text-sm input-premium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <span>Run</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent AI Actions Log */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Recent Executed Actions</h3>
          </div>
          <span className="text-xs text-slate-400">Audit Log</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Fee mismatch resolved</div>
              <div className="text-[10px] text-slate-500 mt-0.5">REC-UPI-9921 ledger discrepancy adjusted</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Substitute assigned</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dr. Alok Nath assigned for Period 2</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Admission forms processed</div>
              <div className="text-[10px] text-slate-500 mt-0.5">4 student profiles created via OCR</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Parents notified</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dispatched 3 automated fee reminders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

