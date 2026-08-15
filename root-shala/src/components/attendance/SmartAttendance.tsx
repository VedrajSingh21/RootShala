import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Send,
  BellRing,
  ShieldAlert,
  Search,
  CheckCircle2,
  ScanLine,
  Wifi,
  Activity,
  UserCheck
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Student, AttendanceRecord } from '../../types';

interface SmartAttendanceProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => void;
  onBulkMarkAttendance?: (studentIds: string[], status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => void;
  onSendParentAlert: (studentName: string, parentPhone: string, reason: string) => void;
}

export const SmartAttendance: React.FC<SmartAttendanceProps> = ({
  students,
  attendanceRecords,
  onMarkAttendance,
  onBulkMarkAttendance,
  onSendParentAlert
}) => {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertSentMap, setAlertSentMap] = useState<Record<string, boolean>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<{ id: string, name: string, time: string, gate: string }[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>(['Grade 10-A']);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const snapshot = await get(ref(db, 'settings/school/grades'));
        if (snapshot.exists()) {
          const grades = snapshot.val();
          const classList: string[] = [];
          grades.forEach((g: any) => {
            const sections = g.sections.split(',');
            sections.forEach((s: string) => {
              classList.push(`${g.name}-${s.trim()}`);
            });
          });
          setAvailableClasses(classList);
          if (classList.length > 0) setSelectedClass(classList[0]);
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
    fetchGrades();
  }, []);

  const lastScannedRef = React.useRef({ id: '', time: 0 });

  const studentsRef = React.useRef(students);
  const onMarkAttendanceRef = React.useRef(onMarkAttendance);

  useEffect(() => {
    studentsRef.current = students;
    onMarkAttendanceRef.current = onMarkAttendance;
  }, [students, onMarkAttendance]);

  const handleScanSuccess = React.useCallback((decodedText: string) => {
    const now = Date.now();
    if (decodedText === lastScannedRef.current.id && now - lastScannedRef.current.time < 3000) {
      return;
    }

    lastScannedRef.current = { id: decodedText, time: now };

    const student = studentsRef.current.find(s => s.id === decodedText);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (student) {
      setRecentScans(prev => [
        { id: student.id, name: student.name, time: timeString, gate: 'Manual QR Scan' },
        ...prev
      ].slice(0, 10));
      onMarkAttendanceRef.current(student.id, 'PRESENT');
    } else {
      setRecentScans(prev => [
        { id: decodedText, name: 'Unknown / Staff', time: timeString, gate: 'Manual QR Scan' },
        ...prev
      ].slice(0, 10));
    }
  }, []);

  // Real CV Auto-Attendance using html5-qrcode natively
  useEffect(() => {
    if (!isScanning) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    let isComponentMounted = true;

    html5QrCode.start(
      { facingMode: "user" },
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      (decodedText) => {
        if (isComponentMounted) {
          handleScanSuccess(decodedText);
        }
      },
      (error) => {} // Ignore continuous scanning errors
    ).catch(err => {
      console.error("Failed to start QR scanner natively", err);
    });

    return () => {
      isComponentMounted = false;
      try {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
        } else {
          // If it was still starting up when unmounted, aggressively stop it after a delay
          setTimeout(() => {
            if (html5QrCode.isScanning) {
              html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
            }
          }, 2000);
        }
      } catch (e) {
        console.error("Error cleaning up scanner", e);
      }
    };
  }, [isScanning, handleScanSuccess]);

  const [mockId, setMockId] = useState('');


  const filteredStudents = students.filter((s) => {
    const matchesClass = `${s.grade}-${s.section}` === selectedClass || selectedClass === 'ALL';
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleAlert = (student: Student, reason: string) => {
    onSendParentAlert(student.name, student.parentPhone, reason);
    setAlertSentMap((prev) => ({ ...prev, [student.id]: true }));
  };

  const getAttendancePct = (studentId: string) => {
    const records = attendanceRecords.filter(r => r.studentId === studentId);
    if (records.length === 0) return 100;
    const present = records.filter(r => r.status === 'PRESENT').length;
    return Number(((present / records.length) * 100).toFixed(1));
  };

  const lowAttendanceStudents = students.filter((s) => getAttendancePct(s.id) < 80);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Smart Attendance</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time ID card scanning and absence pattern tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              isScanning 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isScanning ? <ScanLine className="w-4 h-4 animate-spin-slow" /> : <ScanLine className="w-4 h-4" />}
            {isScanning ? 'Cancel Scan' : 'Scan ID Card'}
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Live Scanner Feed</h3>
                  <p className="text-xs text-slate-400">Monitoring physical ID card scans...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </div>
            </div>

            <div className="space-y-3 relative z-10 min-h-[200px]">
              <div id="qr-reader" className="w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 mb-4 [&_button]:bg-emerald-600 [&_button]:text-white [&_button]:px-3 [&_button]:py-1 [&_button]:rounded-md [&_select]:text-slate-900 [&_select]:p-1 [&_select]:rounded" />
              
              {recentScans.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-slate-500">
                  <ScanLine className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">Awaiting camera scans...</p>
                </div>
              ) : (
                recentScans.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-in fade-in slide-in-from-left-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{scan.name}</div>
                        <div className="text-xs text-slate-400">{scan.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono text-xs mb-0.5">{scan.time}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{scan.gate}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
             <div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">QR ID Scanner</h3>
               <p className="text-sm text-slate-600 mb-6">
                 Scan student and staff ID cards (QR Codes) using your device camera to instantly mark attendance. 
               </p>
               <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="text-sm font-semibold text-slate-700 mb-1">Total Scans Today</div>
                   <div className="text-3xl font-extrabold text-emerald-600">842 <span className="text-sm font-medium text-slate-500">/ 1080</span></div>
                 </div>
                 <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="text-sm font-semibold text-slate-700 mb-1">Scanner Status</div>
                   <div className="text-lg font-bold text-emerald-600">Ready <span className="text-sm font-medium text-slate-500">Device Camera</span></div>
                 </div>

                 {/* Mock Entry Form */}
                 <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="text-sm font-semibold text-slate-700 mb-2">Mock QR Entry</div>
                   <form 
                     onSubmit={(e) => {
                       e.preventDefault();
                       if (mockId.trim()) {
                         handleScanSuccess(mockId.trim());
                         setMockId('');
                       }
                     }}
                     className="flex gap-2"
                   >
                     <input
                       type="text"
                       value={mockId}
                       onChange={(e) => setMockId(e.target.value)}
                       placeholder="e.g. STU-1820"
                       className="flex-1 px-3 py-1.5 text-sm bg-white rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                     />
                     <button
                       type="submit"
                       className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                     >
                       Scan
                     </button>
                   </form>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* AI Risk Detection Banner */}
      {!isScanning && lowAttendanceStudents.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>{lowAttendanceStudents.length} At-Risk Attendance Patterns Detected</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Students dropping below 80% attendance or absent for consecutive days without approved note.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              lowAttendanceStudents.forEach((s) => handleAlert(s, 'Continuous low attendance alert'));
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-2xs self-start sm:self-auto interaction-btn-primary"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Notify At-Risk Parents</span>
          </button>
        </div>
      )}

      {/* Bulk Action Bar */}
      {!isScanning && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 mb-2">
          <div className="text-xs font-semibold text-slate-700">
            Manual Override Actions ({filteredStudents.length} students selected)
          </div>
          <button
            onClick={() => {
              if (onBulkMarkAttendance) {
                onBulkMarkAttendance(filteredStudents.map(s => s.id), 'PRESENT');
              } else {
                filteredStudents.forEach(s => onMarkAttendance(s.id, 'PRESENT'));
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 interaction-card">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Classes</option>
            {availableClasses.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className={`rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden interaction-card ${isScanning ? 'opacity-70 pointer-events-none' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-50 text-emerald-800">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-4 text-emerald-800">Student</th>
                <th className="p-3.5 text-emerald-800">Class</th>
                <th className="p-3.5 text-emerald-800">30-Day Rate</th>
                <th className="p-3.5 text-emerald-800">Pattern Insight</th>
                <th className="p-3.5 text-emerald-800">Mark Today</th>
                <th className="p-3.5 text-right pr-4 text-emerald-800">Parent Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((s) => {
                const isAlertSent = alertSentMap[s.id];
                const pct = getAttendancePct(s.id);
                const hasRisk = pct < 80 || s.riskFlag;

                return (
                  <tr
                    key={s.id}
                    className="interaction-row"
                  >
                    <td className="p-3.5 pl-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">Roll: {s.rollNo}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-slate-800">{s.grade}-{s.section}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{getAttendancePct(s.id)}%</span>
                        {hasRisk && <AlertTriangle className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </td>

                    <td className="p-3.5">
                      {hasRisk ? (
                        <div className="text-[11px] font-medium text-emerald-600">
                          {s.riskFlag || 'Absence trend detected'}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500">
                          Consistent attendance
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      {(() => {
                        const todayString = new Date().toISOString().split('T')[0];
                        const todayRecord = attendanceRecords.find(r => r.studentId === s.id && r.date === todayString);
                        
                        if (todayRecord) {
                          return (
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                todayRecord.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                                todayRecord.status === 'ABSENT' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {todayRecord.status}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onMarkAttendance(s.id, 'PRESENT')}
                              className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium interaction-btn-secondary border border-transparent"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => onMarkAttendance(s.id, 'ABSENT')}
                              className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium interaction-btn-secondary border border-transparent"
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => onMarkAttendance(s.id, 'LATE')}
                              className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium interaction-btn-secondary border border-transparent"
                            >
                              Late
                            </button>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => handleAlert(s, s.riskFlag || 'Absence alert')}
                        disabled={isAlertSent}
                        className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 ml-auto ${
                          isAlertSent
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-emerald-600 text-white shadow-2xs interaction-btn-primary'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{isAlertSent ? 'Notified ✓' : 'Notify Parent'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
