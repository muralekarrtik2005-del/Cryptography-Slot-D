import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, X, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  selectedFile,
  accept = '.txt,.csv,.json,.pdf,.enc,.bin,.dat,.log',
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds maximum size limit of ${maxSizeMB}MB`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        {selectedFile ? (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-lg max-w-full">
            <FileCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-slate-100 truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={clearFile}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-cyan-400 border border-slate-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">
                <span className="text-cyan-400 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports TXT, CSV, JSON, PDF, ENC, BIN, DAT (Up to {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}
    </div>
  );
};
