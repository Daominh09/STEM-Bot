import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Upload, X, FileText, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface DocumentRecord {
  id: number;
  filename: string;
  uploaded_at: string;
}

const PDFUpload: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [clearing, setClearing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/documents/');
      setDocuments(res.data);
    } catch {
      // silently ignore — user may not have uploaded anything yet
    }
  }, []);

  useEffect(() => {
    if (open) fetchDocuments();
  }, [open, fetchDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadStatus('idle');
    }
  };

  const removeSelected = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploadStatus('uploading');

    const formData = new FormData();
    selectedFiles.forEach(f => formData.append('files', f));

    try {
      await axios.post('http://localhost:8000/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('done');
      setSelectedFiles([]);
      if (inputRef.current) inputRef.current.value = '';
      fetchDocuments();
    } catch {
      setUploadStatus('error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Remove all your uploaded documents? This cannot be undone.')) return;
    setClearing(true);
    try {
      await axios.delete('http://localhost:8000/documents/all');
      setDocuments([]);
    } catch {
      // ignore
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm"
      >
        <span className="flex items-center space-x-2">
          <Upload size={14} />
          <span>My Documents {documents.length > 0 ? `(${documents.length})` : ''}</span>
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Uploaded document list */}
          {documents.length > 0 && (
            <div className="space-y-1">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center space-x-1 text-xs text-gray-300">
                  <FileText size={11} className="flex-shrink-0 text-green-400" />
                  <span className="truncate flex-1">{doc.filename}</span>
                </div>
              ))}
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="mt-1 w-full flex items-center justify-center space-x-1 py-1.5 rounded text-xs text-red-400 hover:text-red-300 hover:bg-gray-800 transition disabled:opacity-50"
              >
                <Trash2 size={11} />
                <span>{clearing ? 'Clearing…' : 'Clear all documents'}</span>
              </button>
            </div>
          )}

          {/* File picker */}
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border border-dashed border-gray-600 hover:border-green-500 rounded-lg py-3 text-xs text-gray-400 hover:text-green-400 transition text-center"
          >
            Click to select PDFs
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selected (not yet uploaded) files */}
          {selectedFiles.length > 0 && (
            <ul className="space-y-1">
              {selectedFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center space-x-1 truncate">
                    <FileText size={12} className="flex-shrink-0 text-yellow-400" />
                    <span className="truncate">{f.name}</span>
                  </span>
                  <button onClick={() => removeSelected(i)} className="ml-1 text-gray-500 hover:text-red-400 flex-shrink-0">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading'}
              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium disabled:opacity-50 transition"
            >
              {uploadStatus === 'uploading' ? 'Uploading…' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
          )}

          {uploadStatus === 'done' && (
            <p className="text-xs text-green-400 text-center">Uploaded successfully!</p>
          )}
          {uploadStatus === 'error' && (
            <p className="text-xs text-red-400 text-center">Upload failed. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
