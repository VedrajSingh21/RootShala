import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonPlan {
  title: string;
  objectives: string[];
  sections: { title: string; content: string; durationMins: number }[];
  quiz: { question: string; options: string[]; correctAnswerIndex: number }[];
}

export function LessonPlanner() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('8th Grade');
  const [duration, setDuration] = useState(45);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LessonPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return toast.error('Please enter a topic');
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, grade, duration })
      });

      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setPlan(data);
      toast.success('Lesson Plan Generated!');
    } catch (e) {
      toast.error('Failed to generate lesson plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-400" />
            AI Auto-Lesson Planner
          </h2>
          <p className="text-slate-400 mt-2">Generate comprehensive lesson plans and interactive quizzes in seconds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 backdrop-blur-xl h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Class Level</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option>6th Grade</option>
                  <option>7th Grade</option>
                  <option>8th Grade</option>
                  <option>9th Grade</option>
                  <option>10th Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Duration (mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {loading ? 'Generating...' : 'Generate Lesson'}
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 space-y-6">
          {!plan && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed backdrop-blur-xl p-8">
              <Sparkles className="h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No Plan Generated</h3>
              <p className="text-slate-500 max-w-sm mt-2">Enter a topic on the left to instantly generate a comprehensive lesson plan.</p>
            </div>
          )}

          {plan && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-8 border-b border-slate-700 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                      {grade}
                    </span>
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {duration} Mins
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" title="Download PDF (Demo)">
                  <Download className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <div className="h-6 w-1 bg-emerald-500 rounded-full" />
                    Learning Objectives
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    {plan.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <div className="h-6 w-1 bg-emerald-500 rounded-full" />
                    Lesson Structure
                  </h4>
                  <div className="space-y-4">
                    {plan.sections.map((sec, i) => (
                      <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-emerald-400">{sec.title}</span>
                          <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">{sec.durationMins}m</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.quiz && plan.quiz.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-emerald-500 rounded-full" />
                      Generated Quiz
                    </h4>
                    <div className="space-y-4">
                      {plan.quiz.map((q, i) => (
                        <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                          <p className="font-medium text-white mb-3">{i + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, j) => (
                              <div key={j} className={`p-2 rounded-lg border text-sm ${j === q.correctAnswerIndex ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                {String.fromCharCode(65 + j)}. {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
