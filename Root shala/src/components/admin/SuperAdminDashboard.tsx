import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Users, Key, AlertCircle } from 'lucide-react';
import { ref, get, set, child } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Role } from '../../types';
import { ROLE_PERMISSIONS } from '../../config/rbac';
import toast from 'react-hot-toast';

export const SuperAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newStaffId, setNewStaffId] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Role>('Class Teacher' as Role);
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [generatedPasswordData, setGeneratedPasswordData] = useState<{ id: string, name: string, password: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken') || '';
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!newStaffId || !newName || !newPassword) {
      toast.error('Please fill in all fields.');
      setFeedback({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          staffId: newStaffId,
          name: newName,
          role: newRole,
          password: newPassword,
          email: `${newStaffId.toLowerCase()}@rootshala.com`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register user.');
      }

      setGeneratedPasswordData({
        id: newStaffId,
        name: newName,
        password: newPassword
      });

      toast.success(`User ${newName} added successfully`);
      setFeedback({ type: 'success', message: 'User added successfully' });
      // Reset form
      setNewStaffId('');
      setNewName('');
      setNewPassword('');
      // Refresh list
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to register user.');
      setFeedback({ type: 'error', message: err.message || 'Failed to register user.' });
    }
  };

  return (
    <div className="p-6 premium-container space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Platform Manager</h1>
          <p className="text-slate-500 font-medium text-sm">Manage staff access and roles across the entire platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form */}
        <div className="lg:col-span-1 card-enterprise p-6 interaction-card">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Register New Staff
          </h2>

          <form onSubmit={handleRegisterUser} className="space-y-4">
            {feedback.message && (
              <div className={`p-3 rounded-lg text-sm font-medium flex items-start gap-2 ${feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {feedback.message}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Staff ID</label>
              <input type="text" value={newStaffId} onChange={e => setNewStaffId(e.target.value)} placeholder="e.g. TCH-105" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. John Doe" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Assignment</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value as Role)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                {Object.keys(ROLE_PERMISSIONS).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Temporary Password</label>
              <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="e.g. temp123" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors text-sm"
              >
                Add Staff Member
              </button>
            </div>
          </form>
        </div>

        {/* User List */}
        <div className="lg:col-span-2 card-enterprise overflow-hidden interaction-card">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Active Platform Users
            </h2>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-black rounded-lg">
              {users.length} Total
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-500 text-sm font-medium">Loading user database...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-800 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 text-emerald-800">Staff ID</th>
                    <th className="px-6 py-4 text-emerald-800">Name</th>
                    <th className="px-6 py-4 text-emerald-800">Role</th>
                    <th className="px-6 py-4 text-emerald-800">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="interaction-row">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{u.id}</td>
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-black">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{u.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Roles & Permissions Matrix */}
      <div className="card-enterprise overflow-hidden mt-6 interaction-card">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Roles & Permissions Matrix
          </h2>
          <p className="text-sm text-slate-500 mt-1">Centralized RBAC architecture read-only view. Shows active permissions for each role.</p>
        </div>
        
        <div className="overflow-x-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
              <div key={role} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">{role}</div>
                <div className="flex flex-wrap gap-1.5">
                  {permissions.map((perm: string) => (
                    <span key={perm} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-mono rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {generatedPasswordData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Staff Account Created</h2>
            <p className="text-sm text-slate-500 mb-6">
              Please securely share these credentials with {generatedPasswordData.name}. 
              The password will <strong>not</strong> be shown again.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Staff ID</span>
                <span className="font-mono font-black text-slate-900">{generatedPasswordData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Temp Password</span>
                <span className="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{generatedPasswordData.password}</span>
              </div>
            </div>

            <button 
              onClick={() => setGeneratedPasswordData(null)}
              className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
            >
              I have saved the credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
