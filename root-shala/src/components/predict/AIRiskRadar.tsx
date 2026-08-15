import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';
import { Student, AttendanceRecord, CollaborativeTask } from '../../types';
import toast from 'react-hot-toast';

interface RiskPrediction {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  reasoning: string;
  interventionPlan: string;
}

interface AIRiskRadarProps {
  students: Student[];
  attendance: AttendanceRecord[];
  tasks: CollaborativeTask[];
}

export function AIRiskRadar({ students, attendance, tasks }: AIRiskRadarProps) {
  const [predictions, setPredictions] = useState<Record<string, RiskPrediction>>({});
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          students: students.slice(0, 10), // Send a subset to avoid payload size issues in demo
          attendance: attendance.slice(0, 50),
          tasks: tasks.slice(0, 20)
        })
      });

      if (!response.ok) throw new Error('Prediction failed');
      const data = await response.json();
      setPredictions(data);
      setAnalyzed(true);
      toast.success('AI Risk Analysis Complete');
    } catch (e) {
      toast.error('Failed to analyze risks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-rose-400 bg-rose-400/10 border-rose-500/50';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-500/50';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-indigo-400" />
            EduPredict Risk Radar
          </h2>
          <p className="text-slate-400 mt-2">AI-powered early warning system for student success.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Zap className="h-5 w-5" />
          )}
          {loading ? 'Analyzing Data...' : 'Run Deep Analysis'}
        </button>
      </div>

      {!analyzed && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="h-20 w-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <BarChart3 className="h-10 w-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
          <p className="text-slate-400 max-w-md">
            Click 'Run Deep Analysis' to securely pass anonymized attendance and task metrics through our Gemini predictive engine.
          </p>
        </div>
      )}

      {analyzed && Object.keys(predictions).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {Object.entries(predictions).map(([studentId, predictionObj]) => {
            const prediction = predictionObj as RiskPrediction;
            const student = students.find(s => s.id === studentId);
            if (!student) return null;

            return (
              <div key={studentId} className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${getRiskColor(prediction.riskLevel)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{student.name}</h3>
                    <p className="text-sm opacity-80">{student.grade}</p>
                  </div>
                  {prediction.riskLevel === 'High' ? (
                    <AlertTriangle className="h-6 w-6 animate-pulse" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Risk Score</span>
                    <span className="font-bold">{prediction.riskScore}/100</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-current rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">AI Reasoning</p>
                    <p className="text-sm text-white/90 leading-relaxed">{prediction.reasoning}</p>
                  </div>
                  <div className="pt-4 border-t border-current/20">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">Action Plan</p>
                    <p className="text-sm font-medium leading-relaxed">{prediction.interventionPlan}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
