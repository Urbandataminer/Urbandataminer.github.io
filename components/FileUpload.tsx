import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null);
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }
    // Simple size check (e.g., 20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        setError("File size exceeds the 20MB limit.");
        return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div 
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10 
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          bg-white shadow-sm hover:shadow-md
          ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-200 hover:border-indigo-300'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center animate-fade-in">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Processing PDF...</h3>
            <p className="text-gray-500 mt-2">Extracting text and preparing AI...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
              <Upload className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Chat with any PDF
            </h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Drag & drop your document here, or click to browse.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <FileText className="w-4 h-4" />
                <span>Supports PDF up to 20MB</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-fade-in border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
