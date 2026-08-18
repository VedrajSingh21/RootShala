import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  FileSearch,
  AlertTriangle,
  Phone,
  ShieldAlert,
  X
} from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Student, FeeRecord, AttendanceRecord, DocumentItem } from '../../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onOpenDocOCR: (studentName: string) => void;
  fees?: FeeRecord[];
  attendance?: AttendanceRecord[];
  documents?: DocumentItem[];
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onOpenDocOCR,
  fees = [],
  attendance = [],
  documents = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reassignStudent, setReassignStudent] = useState<Student | null>(null);
  const [reassignData, setReassignData] = useState({ grade: 'Grade 10', section: 'A' });
  const [availableGrades, setAvailableGrades] = useState<{name: string, sections: string}[]>([
    { name: 'Grade 10', sections: 'A, B, C' }
  ]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const snapshot = await get(ref(db, 'settings/school/grades'));
        if (snapshot.exists()) {
          setAvailableGrades(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
    fetchGrades();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    grade: 'Grade 10',
    section: 'A',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    totalFees: 45000,
    paidFees: 45000
  });

  const getAttendancePct = (studentId: string) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 100;
    const presentDays = studentAttendance.filter(a => a.status === 'PRESENT').length;
    return Number(((presentDays / studentAttendance.length) * 100).toFixed(1));
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesFee = selectedFeeStatus === 'ALL' || s.feeStatus === selectedFeeStatus;

    return matchesSearch && matchesClass && matchesFee;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo) return;

    const newStudent: Student = {
      id: `STU-${1000 + students.length + 1}`,
      name: formData.name,
      rollNo: formData.rollNo,
      grade: formData.grade,
      section: formData.section,
      parentName: formData.parentName || 'Parent Name',
      parentPhone: formData.parentPhone || '+91 99000 00000',
      parentEmail: formData.parentEmail || 'parent@example.com',
      feeStatus: formData.paidFees >= formData.totalFees ? 'PAID' : 'PARTIAL',
      documentsStatus: 'VERIFIED'
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setFormData({
      name: '',
      rollNo: '',
      grade: availableGrades[0]?.name || 'Grade 10',
      section: availableGrades[0]?.sections.split(',')[0].trim() || 'A',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      totalFees: 45000,
      paidFees: 45000
    });
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reassignStudent) {
      onUpdateStudent(reassignStudent.id, { grade: reassignData.grade, section: reassignData.section });
      setReassignStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Students</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student records, attendance and academic information.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium interaction-btn-primary flex items-center gap-1.5 rounded-xl shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, roll number, or parent..."
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Classes</option>
            {availableGrades.map((g, idx) => (
              <option key={idx} value={g.name}>{g.name}</option>
            ))}
          </select>

          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Fee Status</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>
      </div>

      {/* Clean Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden interaction-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-50 text-emerald-800">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-4 text-emerald-800">Student</th>
                <th className="p-3.5 text-emerald-800">Class & Roll</th>
                <th className="p-3.5 text-emerald-800">Parent Contact</th>
                <th className="p-3.5 text-emerald-800">Attendance</th>
                <th className="p-3.5 text-emerald-800">Fee Status</th>
                <th className="p-3.5 text-emerald-800">Documents</th>
                <th className="p-3.5 text-right pr-4 text-emerald-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="interaction-row"
                >
                  <td className="p-3.5 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{s.name}</span>
                          {s.riskFlag && (
                            <AlertTriangle className="w-3.5 h-3.5 text-emerald-500" title={s.riskFlag} />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{s.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-slate-800">{s.grade} - {s.section}</span>
                    <div className="text-[10px] text-slate-400">Roll: {s.rollNo}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-medium text-slate-800">{s.parentName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{s.parentPhone}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    {(() => {
                      const pct = getAttendancePct(s.id);
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                pct >= 90 ? 'bg-emerald-500' : pct >= 80 ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-medium text-slate-700">{pct}%</span>
                        </div>
                      );
                    })()}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        s.feeStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.feeStatus === 'PENDING'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.feeStatus === 'PARTIAL'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {s.feeStatus}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                        s.documentsStatus === 'VERIFIED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {s.documentsStatus}
                    </span>
                  </td>

                  <td className="p-3.5 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setReassignStudent(s);
                          setReassignData({ grade: s.grade, section: s.section });
                        }}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Reassign Class"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="View Details"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {/* Unified Student 360 Modal */}
      {selectedStudent && (() => {
        const studentFees = fees.filter(f => f.studentId === selectedStudent.id);
        const pendingInvoices = studentFees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE');
        const calculatedPendingFees = pendingInvoices.reduce((sum, f) => sum + f.amount, 0);
        const calculatedTotalFees = studentFees.reduce((sum, f) => sum + f.amount, 0);
        
        const studentAttendance = attendance.filter(a => a.studentId === selectedStudent.id);
        const calculatedAttendancePct = getAttendancePct(selectedStudent.id);

        const studentDocs = documents.filter(d => 
          d.studentOrTeacherName?.toLowerCase().includes(selectedStudent.name.split(' ')[0].toLowerCase())
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center shrink-0">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400">{selectedStudent.id} • {selectedStudent.grade} ({selectedStudent.section})</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Financial Summary */}
                <div className="p-3 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                  <div className="font-semibold text-slate-700 flex justify-between">
                    <span>Finances</span>
                    <span className="text-[10px] text-slate-400">({studentFees.length} records)</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Fees</span>
                      <span className="font-medium text-slate-900">₹{calculatedTotalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1">
                      <span className="text-slate-500">Pending Balance</span>
                      <span className={`font-bold ${calculatedPendingFees > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{calculatedPendingFees.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {pendingInvoices.map((inv, idx) => (
                    <div key={idx} className="text-[10px] bg-white p-1.5 rounded border border-slate-200 mt-2">
                      <div className="font-medium text-slate-800">{inv.type}</div>
                      <div className="text-slate-400 flex justify-between">
                        <span>Due: {inv.dueDate}</span>
                        <span>₹{inv.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attendance Summary */}
                <div className="p-3 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                  <div className="font-semibold text-slate-700 flex justify-between">
                    <span>Attendance</span>
                    <span className="text-[10px] text-slate-400">({studentAttendance.length} records)</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className={`text-2xl font-bold ${calculatedAttendancePct < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {calculatedAttendancePct.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    {studentAttendance.slice(0, 3).map((record, idx) => (
                      <div key={idx} className="text-[10px] flex justify-between items-center bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500">{record.date}</span>
                        <span className={`font-semibold ${record.status === 'PRESENT' ? 'text-emerald-600' : record.status === 'ABSENT' ? 'text-rose-600' : 'text-amber-600'}`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                    {studentAttendance.length > 3 && <div className="text-[10px] text-center text-slate-400">...and more</div>}
                  </div>
                </div>

                {/* Documents & OCR */}
                <div className="p-3 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                  <div className="font-semibold text-slate-700 flex justify-between">
                    <span>Linked Documents</span>
                    <span className="text-[10px] text-slate-400">({studentDocs.length} records)</span>
                  </div>
                  {studentDocs.length === 0 ? (
                    <div className="text-[10px] text-slate-400 italic py-2 text-center">No OCR documents linked</div>
                  ) : (
                    <div className="space-y-1">
                      {studentDocs.map((doc, idx) => (
                        <div key={idx} className="text-[10px] bg-white p-1.5 rounded border border-slate-200">
                          <div className="font-medium text-slate-800 truncate">{doc.fileName}</div>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-slate-400">{doc.type}</span>
                            <span className={`px-1 py-0.5 rounded font-semibold ${doc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onOpenDocOCR(selectedStudent.name);
                      setSelectedStudent(null);
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium text-[10px] hover:bg-emerald-200 transition-colors"
                  >
                    + Scan New Document
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                 <div className="p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">Parent Contact Details</span>
                    <div className="grid grid-cols-2 gap-2">
                       <div><span className="text-slate-400">Name:</span> {selectedStudent.parentName}</div>
                       <div><span className="text-slate-400">Phone:</span> {selectedStudent.parentPhone}</div>
                       <div><span className="text-slate-400">Email:</span> {selectedStudent.parentEmail}</div>
                    </div>
                 </div>
              </div>
              
              {selectedStudent.riskFlag && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2 text-xs">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Risk Alert:</span>
                    <p className="mt-0.5">{selectedStudent.riskFlag}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Add Student</h3>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    placeholder="10-A-09"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value, section: availableGrades.find(g => g.name === e.target.value)?.sections.split(',')[0].trim() || 'A' })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    {availableGrades.map((g, idx) => (
                      <option key={idx} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    {(availableGrades.find(g => g.name === formData.grade)?.sections || 'A,B,C').split(',').map((sec, idx) => (
                      <option key={idx} value={sec.trim()}>{sec.trim()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Parent Name</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  placeholder="Parent / Guardian"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    placeholder="+91 98765 00000"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium interaction-btn-primary"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Class Modal */}
      {reassignStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setReassignStudent(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Reassign Class</h3>
            <p className="text-xs text-slate-500">Move {reassignStudent.name} to a new class section.</p>

            <form onSubmit={handleReassignSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Grade</label>
                  <select
                    value={reassignData.grade}
                    onChange={(e) => setReassignData({ ...reassignData, grade: e.target.value, section: availableGrades.find(g => g.name === e.target.value)?.sections.split(',')[0].trim() || 'A' })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    {availableGrades.map((g, idx) => (
                      <option key={idx} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Section</label>
                  <select
                    value={reassignData.section}
                    onChange={(e) => setReassignData({ ...reassignData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    {(availableGrades.find(g => g.name === reassignData.grade)?.sections || 'A,B,C').split(',').map((sec, idx) => (
                      <option key={idx} value={sec.trim()}>{sec.trim()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white font-medium rounded-xl shadow-2xs hover:bg-emerald-700"
                >
                  Save Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

