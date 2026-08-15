import React, { useState } from 'react';
import {
  Upload,
  AlertTriangle,
  Send,
  RefreshCw,
  X,
  Search
} from 'lucide-react';
import { FeeRecord, Student } from '../../types';
import toast from 'react-hot-toast';

interface SmartFeeManagementProps {
  feeRecords: FeeRecord[];
  students: Student[];
  onUploadReceipt: (fileName: string, studentName: string) => void;
  onResolveMismatch: (feeId: string) => void;
  onSendReminder: (studentName: string) => void;
}

export const SmartFeeManagement: React.FC<SmartFeeManagementProps> = ({
  feeRecords,
  students,
  onUploadReceipt,
  onResolveMismatch,
  onSendReminder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedFeeForReview, setSelectedFeeForReview] = useState<FeeRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [showBankReconModal, setShowBankReconModal] = useState(false);
  const [remindedMap, setRemindedMap] = useState<Record<string, boolean>>({});

  const filteredFees = feeRecords.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || f.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleRealOCRScan = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file first.');
      return;
    }
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const res = await fetch('/api/documents/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64data,
            mimeType: selectedFile.type,
            documentType: 'FEE_RECEIPT',
            fileName: selectedFile.name
          })
        });
        const data = await res.json();
        
        if (data.error) {
          toast.error(`OCR Error: ${data.error}`);
        } else {
          toast.success('Receipt scanned successfully!');
          onUploadReceipt(selectedFile.name, data.extractedFields?.studentName || 'Unknown Student');
          setShowReceiptModal(false);
          setSelectedFile(null);
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (e) {
      setIsScanning(false);
      toast.error('Failed to process image');
    }
  };

  const handleSimulateBankRecon = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setShowBankReconModal(false);
      // Automatically resolve some mismatches or simulate successful batch
      // In a real app, this would process a CSV. Here we just trigger a UI update.
      alert('Bank Statement Reconciled: 45 matching records automatically cleared. 1 new discrepancy flagged.');
    }, 1500);
  };

  const handleReminder = (fee: FeeRecord) => {
    onSendReminder(fee.studentName);
    setRemindedMap((prev) => ({ ...prev, [fee.id]: true }));
  };

  const totalCollected = feeRecords.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = feeRecords.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
  const mismatches = feeRecords.filter((f) => f.status === 'MISMATCH');

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Fees</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track fee collections, bank receipt reconciliation, and outstanding dues.
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowBankReconModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs interaction-btn-primary"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Bank CSV Recon</span>
          </button>
          
          <button
            onClick={() => setShowReceiptModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs interaction-btn-primary"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Receipt OCR</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Stripe */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Collected</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            ₹{totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Verified against bank records</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Pending Outstanding</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tracking-tight">
            ₹{totalPending.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Automated reminders active</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Flagged Mismatches</span>
          <div className="text-2xl font-bold text-red-600 mt-1 tracking-tight">
            {mismatches.length} Item
          </div>
          <p className="text-xs text-slate-400 mt-1">Requires manual review</p>
        </div>
      </div>

      {/* Mismatch Alert Box */}
      {mismatches.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Discrepancy Detected for Ananya Verma (REC-UPI-9921)</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Receipt read as ₹12,000, but invoice billed amount is ₹15,000.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedFeeForReview(mismatches[0])}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium shrink-0 self-start sm:self-auto shadow-2xs interaction-btn-primary"
          >
            Review Discrepancy
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 interaction-card">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or invoice..."
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="MISMATCH">MISMATCH</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden interaction-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-50 text-emerald-800">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-4 text-emerald-800">Invoice & Student</th>
                <th className="p-3.5 text-emerald-800">Billed</th>
                <th className="p-3.5 text-emerald-800">Paid</th>
                <th className="p-3.5 text-emerald-800">Receipt & Mode</th>
                <th className="p-3.5 text-emerald-800">Status</th>
                <th className="p-3.5 text-right pr-4 text-emerald-800">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFees.map((fee) => {
                const isReminded = remindedMap[fee.id];

                return (
                  <tr key={fee.id} className="interaction-row">
                    <td className="p-3.5 pl-4">
                      <div className="font-semibold text-slate-900">{fee.studentName}</div>
                      <div className="text-[10px] text-slate-400">{fee.invoiceNo} • {fee.gradeClass}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-slate-900">₹{fee.amount.toLocaleString()}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-emerald-600">₹{fee.paidAmount.toLocaleString()}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{fee.receiptNo || 'Pending'}</div>
                      <div className="text-[10px] text-slate-400">{fee.paymentMode || 'Online'}</div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          fee.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : fee.status === 'PENDING'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : fee.status === 'MISMATCH'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      {fee.status === 'MISMATCH' ? (
                        <button
                          onClick={() => setSelectedFeeForReview(fee)}
                          className="px-3 py-1 rounded bg-red-600 text-white font-medium text-xs interaction-btn-primary"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReminder(fee)}
                          disabled={fee.status === 'PAID' || isReminded}
                          className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ml-auto ${
                            fee.status === 'PAID' || isReminded
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-emerald-600 text-white shadow-2xs interaction-btn-primary'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{isReminded ? 'Sent ✓' : 'Reminder'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OCR Upload Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Receipt OCR Reader</h3>
              <p className="text-xs text-slate-400">Extracts UTR, bank name, and payment amount</p>
            </div>

            <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center space-y-2 cursor-pointer bg-slate-50 relative hover:bg-slate-100 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-medium text-slate-700">
                {selectedFile ? selectedFile.name : "Drop receipt scan or click to browse"}
              </div>
            </div>

            <button
              onClick={handleRealOCRScan}
              disabled={isScanning || !selectedFile}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Receipt...</span>
                </>
              ) : (
                <span>AI Receipt Extraction</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bank CSV Reconciliation Modal */}
      {showBankReconModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setShowBankReconModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Bank Statement Reconciliation</h3>
              <p className="text-xs text-slate-400">Match statement lines against ledger exactly (Layer 2 Deterministic)</p>
            </div>

            <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center space-y-2 cursor-pointer bg-slate-50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-medium text-slate-700">
                Drop HDFC/ICICI Bank .CSV statement here
              </div>
            </div>

            <button
              onClick={handleSimulateBankRecon}
              disabled={isReconciling}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs flex items-center justify-center gap-2"
            >
              {isReconciling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Matching Records...</span>
                </>
              ) : (
                <span>Run Ledger Reconciliation</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Discrepancy Resolution Modal */}
      {selectedFeeForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl relative space-y-4">
            <button
              onClick={() => setSelectedFeeForReview(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Fee Discrepancy Approval</h3>
              <p className="text-xs text-slate-400">Confidence low (&lt;90%)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold text-slate-900">{selectedFeeForReview.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Billed:</span>
                <span className="font-semibold text-slate-900">₹{selectedFeeForReview.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt Amount Scanned:</span>
                <span className="font-semibold text-red-600">₹{selectedFeeForReview.paidAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFeeForReview(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs"
              >
                Reject Receipt
              </button>
              <button
                onClick={() => {
                  onResolveMismatch(selectedFeeForReview.id);
                  setSelectedFeeForReview(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700"
              >
                Approve Partial Waiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

