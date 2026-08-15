import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface AIDocumentCenterProps {
  documents: DocumentItem[];
  onUploadDocument: (doc: DocumentItem) => void;
  onApproveDocument: (docId: string) => void;
  onRejectDocument: (docId: string) => void;
}

export const AIDocumentCenter: React.FC<AIDocumentCenterProps> = ({
  documents,
  onUploadDocument,
  onApproveDocument,
  onRejectDocument
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [pendingDoc, setPendingDoc] = useState<DocumentItem | null>(null);
  const [uploadType, setUploadType] = useState('ADMISSION_FORM');
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editFields, setEditFields] = useState<Record<string, any>>({});

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.studentOrTeacherName && d.studentOrTeacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsProcessing(true);
      
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/documents/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type,
              documentType: uploadType,
              fileName: file.name
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          const newDoc: DocumentItem = {
            id: `DOC-${Date.now()}`,
            fileName: file.name,
            type: uploadType as any,
            uploadedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            extractedFields: data.extractedFields || {},
            confidenceScore: data.confidenceScore || 0,
            confidenceScores: data.confidenceScores || {},
            status: data.status || 'NEEDS_REVIEW',
            reason: data.reason || '',
            fileSize: `${(file.size / 1024).toFixed(0)} KB`,
            source: 'ai_extraction_reviewed'
          };
          setEditFields(newDoc.extractedFields);
          setPendingDoc(newDoc);
        } catch (err) {
          console.error(err);
          alert("Failed to extract document. Please check the API key and try again.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openReviewModal = (doc: DocumentItem) => {
    setEditFields(doc.extractedFields);
    setSelectedDoc(doc);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditFields(prev => ({ ...prev, [key]: value }));
  };

  const handleApprovePending = () => {
    if (pendingDoc) {
      const finalDoc = { ...pendingDoc, extractedFields: editFields, status: 'APPROVED' as const };
      onUploadDocument(finalDoc);
      setPendingDoc(null);
    }
  };

  const handleApproveSelected = () => {
    if (selectedDoc) {
      onApproveDocument(selectedDoc.id);
      setSelectedDoc(null);
    }
  };

  const renderModal = (doc: DocumentItem, isPending: boolean) => {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl relative space-y-4 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => isPending ? setPendingDoc(null) : setSelectedDoc(null)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{doc.fileName}</h3>
              <p className="text-xs text-slate-400">{doc.type} • Confidence: {doc.confidenceScore}%</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 border border-slate-200">
            <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <div className="font-semibold text-slate-800">
              {isPending ? "Review AI Extraction" : "OCR Scan Verification"}
            </div>
            <p className="text-[10px] mt-0.5">Please verify all extracted fields before approving.</p>
            {doc.reason && <p className="text-amber-600 font-medium mt-1">{doc.reason}</p>}
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-900">Parsed Fields:</div>
            <div className="p-3 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
              {Object.entries(editFields).map(([k, v]) => {
                const conf = doc.confidenceScores?.[k] || 100;
                const isLow = conf < 90;
                return (
                  <div key={k} className="flex flex-col gap-1 border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 capitalize font-medium">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {conf}%
                      </span>
                    </div>
                    {isPending || doc.status === 'NEEDS_REVIEW' ? (
                      <input 
                        type="text"
                        value={v}
                        onChange={(e) => handleFieldChange(k, e.target.value)}
                        className={`w-full px-2 py-1 rounded bg-white border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isLow ? 'border-amber-300' : 'border-slate-300'}`}
                      />
                    ) : (
                      <span className="font-semibold text-slate-800">{String(v)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => isPending ? setPendingDoc(null) : setSelectedDoc(null)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs hover:bg-slate-200"
            >
              Cancel
            </button>
            {isPending ? (
              <button
                onClick={handleApprovePending}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs interaction-btn-primary"
              >
                Approve & Save
              </button>
            ) : doc.status === 'NEEDS_REVIEW' ? (
              <button
                onClick={handleApproveSelected}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs interaction-btn-primary"
              >
                Approve Data
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Document Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Optical field extraction across admission forms, fee receipts, and leave applications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select 
            value={uploadType} 
            onChange={(e) => setUploadType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="ADMISSION_FORM">Admission Form</option>
            <option value="FEE_RECEIPT">Fee Receipt</option>
            <option value="LEAVE_APPLICATION">Leave Application</option>
          </select>
          <label className="px-4 py-2 rounded-xl bg-emerald-600 interaction-btn-primary text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {isProcessing && (
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Running Gemini AI extraction...</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name or person..."
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-100/70 rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="ADMISSION_FORM">Admission Form</option>
          <option value="FEE_RECEIPT">Fee Receipt</option>
          <option value="LEAVE_APPLICATION">Leave Application</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interaction-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm truncate max-w-xs">{doc.fileName}</h3>
                    <div className="text-[10px] text-slate-400">{doc.type} • {doc.uploadedAt}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                  OCR: {doc.confidenceScore}%
                </span>
              </div>

              {doc.reason && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 my-2 flex items-start gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{doc.reason}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1 my-2">
                <div className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider mb-1">
                  Extracted Fields
                </div>
                {Object.entries(doc.extractedFields).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium text-slate-800">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openReviewModal(doc)}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Review Scan</span>
              </button>

              {doc.status === 'NEEDS_REVIEW' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRejectDocument(doc.id)}
                    className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Reject Scan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onApproveDocument(doc.id);
                    }}
                    className="px-3 py-1 rounded-md bg-emerald-600 text-white font-medium text-xs interaction-btn-primary transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Approved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {pendingDoc && renderModal(pendingDoc, true)}
      {selectedDoc && renderModal(selectedDoc, false)}
    </div>
  );
};
