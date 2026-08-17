import React, { useState, useEffect } from 'react';
import { Role, CurrentUser } from '../../types';
import { ShieldCheck, User, Lock, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ref, get, child } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (user: CurrentUser) => void;
  prefillId?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, prefillId }) => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState(prefillId || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [detectedUser, setDetectedUser] = useState<CurrentUser | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const id = staffId.trim();
      if (id.length < 4) {
        setDetectedUser(null);
        return;
      }

      setIsDetecting(true);
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${id}`));
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setDetectedUser({
            id: userData.id,
            name: userData.name,
            role: userData.role as Role,
            class_id: userData.class_id
          });
        } else {
          setDetectedUser(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsDetecting(false);
      }
    };

    const debounceTimer = setTimeout(checkUser, 500);
    return () => clearTimeout(debounceTimer);
  }, [staffId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!staffId.trim()) {
      setError('Staff ID is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsAuthenticating(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: staffId.trim(), password })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Invalid response from server (possibly a 500/404 HTML page).');
      }
      
      if (response.ok && data.success) {
        // Save session token for API usage (e.g. Super Admin dashboard)
        // Purposely NOT saving currentUser in localStorage to force re-login on page refresh.
        localStorage.setItem('sessionToken', data.token);
        
        onLogin(data.user);
      } else {
        setError(data?.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server connection error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-emerald-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-600 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white backdrop-blur-md rounded-xl text-slate-700 font-bold shadow-sm transition-all z-20 border border-slate-200/50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <img src="/Logo.png" alt="RootShala Logo" className="h-16 object-contain mb-6 drop-shadow-md" />
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-600 tracking-tight mb-2">RootShala</h1>
          <p className="text-sm text-slate-500 font-medium">Secure Staff Authentication</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}



          {/* Staff ID */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Staff ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. TCH-202"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                autoFocus={!prefillId}
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus={!!prefillId}
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-11 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {prefillId && (
              <p className="text-xs text-slate-500 font-medium ml-1">
                Demo Password: <span className="font-mono text-slate-700">password123</span>
              </p>
            )}
          </div>





          {/* Detected User Profile */}
          {detectedUser && (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0 shadow-inner">
                {detectedUser.name.charAt(0)}
              </div>
              <div className="flex-1 truncate">
                <div className="text-sm font-bold text-slate-900 truncate">{detectedUser.name}</div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider truncate">{detectedUser.role}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white shadow-xl transition-all ${
              isAuthenticating 
                ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 shadow-emerald-600/25 active:scale-[0.98]'
            }`}
          >
            {isAuthenticating ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authenticating Protocol...</span>
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Initialize Session</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs font-medium text-slate-400">
          <p>Protected by AI Surveillance Matrix</p>
          <p className="mt-1">Unauthorized access will be logged</p>
        </div>
      </div>
    </div>
  );
};
