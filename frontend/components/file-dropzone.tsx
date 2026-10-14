"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const PDF_SIZE_ERROR = "File size exceeds the 10MB limit.";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelected, disabled }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        
        if (file.size > MAX_PDF_SIZE_BYTES) {
          toast.error(PDF_SIZE_ERROR);
          return;
        }

        if (file.name.toLowerCase().endsWith(".pdf")) {
          setSelectedFile(file);
          onFileSelected(file);
        } else {
          toast.error("Only PDF files are supported.");
        }
      }
    },
    [onFileSelected, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        
        if (file.size > MAX_PDF_SIZE_BYTES) {
          toast.error(PDF_SIZE_ERROR);
          e.target.value = "";
          return;
        }

        if (file.name.toLowerCase().endsWith(".pdf")) {
          setSelectedFile(file);
          onFileSelected(file);
        } else {
          toast.error("Only PDF files are supported.");
          e.target.value = "";
        }
      }
    },
    [onFileSelected, disabled]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-300 cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {selectedFile ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
            <FileText className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="ml-2 p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center size-14 rounded-full bg-muted mb-4">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Drop your PDF here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports .pdf files only · Max 10 MB
          </p>
        </>
      )}

      <input
        id="file-upload-input"
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
