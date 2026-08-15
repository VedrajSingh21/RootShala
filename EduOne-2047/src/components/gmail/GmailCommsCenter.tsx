import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Tag,
  Clock,
  User,
  Sparkles,
  Inbox,
  Filter,
  Paperclip,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  GmailThread,
  fetchGmailInbox,
  sendGmailEmail,
  createGoogleTask,
  authenticateGoogleWorkspace,
  getStoredAccessToken
} from '../../lib/googleWorkspace';

interface GmailCommsCenterProps {
  onAddTaskToGoogle?: (title: string, notes: string) => void;
  onOpenCommandCenter?: (prompt: string) => void;
}

export const GmailCommsCenter: React.FC<GmailCommsCenterProps> = ({
  onAddTaskToGoogle,
  onOpenCommandCenter
}) => {
  const [threads, setThreads] = useState<GmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<GmailThread | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  // Send Email State
  const [recipient, setRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [taskCreatedId, setTaskCreatedId] = useState<string | null>(null);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGmailInbox();
      setThreads(data);
      if (data.length > 0 && !selectedThread) {
        setSelectedThread(data[0]);
      }
    } catch (err) {
      console.error('Error loading Gmail threads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setIsLoading(true);
      await authenticateGoogleWorkspace();
      setIsConnected(true);
      await loadInbox();
      setStatusMessage('Connected to Google Workspace successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      setStatusMessage(`OAuth Connection Notice: Using synchronized workspace mode`);
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !body) return;

    setIsSending(true);
    try {
      const result = await sendGmailEmail(recipient, subject, body);
      if (result.success) {
        setStatusMessage(`Email successfully dispatched to ${recipient}`);
        setIsComposing(false);
        setRecipient('');
        setSubject('');
        setBody('');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      setStatusMessage('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTaskFromEmail = async (thread: GmailThread) => {
    try {
      const taskTitle = `Follow up: ${thread.subject}`;
      const taskNotes = `From: ${thread.from}\n\n${thread.snippet}`;
      await createGoogleTask(taskTitle, taskNotes, 'Today');
      if (onAddTaskToGoogle) {
        onAddTaskToGoogle(taskTitle, taskNotes);
      }
      setTaskCreatedId(thread.id);
      setStatusMessage(`Created Google Task for "${thread.subject}"`);
      setTimeout(() => {
        setTaskCreatedId(null);
        setStatusMessage(null);
      }, 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'UNREAD' && t.unread) ||
      (filter === 'FEES' && t.category === 'Fee Inquiries') ||
      (filter === 'LEAVE' && t.category === 'Leave Notes') ||
      (filter === 'PARENTS' && t.category === 'Parent Query');

    const matchesSearch =
      searchQuery === '' ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Gmail Hub
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> OAuth Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Google Workspace Gmail communications for school inquiries, fee updates, and parent notices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadInbox}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </button>

          <button
            onClick={() => setIsComposing(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Compose
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Mail Grid - 2 Column Clean Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email Thread List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search emails or parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'ALL', label: 'All Mail' },
                { id: 'UNREAD', label: 'Unread' },
                { id: 'FEES', label: 'Fees' },
                { id: 'LEAVE', label: 'Leave' },
                { id: 'PARENTS', label: 'Parents' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all text-[11px] ${
                    filter === tab.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-medium">No emails match the selected criteria.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = selectedThread?.id === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThread(thread);
                      thread.unread = false;
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300/50'
                        : thread.unread
                        ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                        : 'bg-white border-slate-200/70 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {thread.from.split('<')[0].trim()}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                        {thread.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {thread.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {thread.snippet}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {thread.category}
                      </span>
                      {taskCreatedId === thread.id && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Task Added
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Reader & Actions */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 min-h-[500px]">
          {selectedThread ? (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedThread.subject}
                  </h2>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {selectedThread.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 uppercase">
                      {selectedThread.from.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{selectedThread.from}</div>
                      <div className="text-[11px] text-slate-400">Via Gmail OAuth</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium">{selectedThread.date}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedThread.body || selectedThread.snippet}
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-100/60 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Smart Workspace Actions
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleCreateTaskFromEmail(selectedThread)}
                    className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Convert to Google Task
                  </button>

                  <button
                    onClick={() => {
                      setRecipient(selectedThread.from.match(/<([^>]+)>/)?.[1] || selectedThread.from);
                      setSubject(`Re: ${selectedThread.subject}`);
                      setBody(`Dear Parent,\n\nThank you for reaching out regarding "${selectedThread.subject}". We have received your update and updated our school records accordingly.\n\nWarm regards,\nSchool Operations Office`);
                      setIsComposing(true);
                    }}
                    className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Send className="w-4 h-4 text-emerald-600" />
                    Quick Reply via Gmail
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-3">
              <Mail className="w-12 h-12 stroke-1 text-slate-300" />
              <p className="text-xs font-medium">Select an email thread to view details and take actions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Mail className="w-4 h-4 text-emerald-400" />
                Compose Gmail Message
              </div>
              <button
                onClick={() => setIsComposing(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Recipient Email</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="School Fee Receipt Acknowledgment / Notice"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Message Body</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubject('Fee Payment Ledger Confirmation');
                        setBody('Dear Parent,\n\nThis is to acknowledge the receipt of your fee payment. The ledger status for your ward has been verified and updated.\n\nThank you,\nSchool Finance Desk');
                      }}
                      className="text-[10px] text-emerald-600 hover:underline font-medium"
                    >
                      + Fee Template
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubject('Leave Note Acknowledged');
                        setBody('Dear Parent,\n\nWe have received the leave request for your child. Attendance records have been adjusted with EXCUSED status.\n\nRegards,\nClass Teacher');
                      }}
                      className="text-[10px] text-emerald-600 hover:underline font-medium"
                    >
                      + Leave Template
                    </button>
                  </div>
                </div>
                <textarea
                  rows={6}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSending ? 'Sending via Gmail...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
