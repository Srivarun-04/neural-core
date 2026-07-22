"use client";

import React, { useState } from "react";
import type { FileType } from "./types";

interface UploadZoneProps {
  onFileDrop?: (files: FileList) => void;
}

/** File type definitions shown in the upload zone */
const SUPPORTED_TYPES: { type: FileType; label: string; ext: string; color: string }[] = [
  { type: "pdf",   label: "PDF",      ext: ".pdf",  color: "#f87171" },
  { type: "docx",  label: "DOCX",     ext: ".docx", color: "#60a5fa" },
  { type: "md",    label: "Markdown", ext: ".md",   color: "#a78bfa" },
  { type: "txt",   label: "Text",     ext: ".txt",  color: "#94a3b8" },
  { type: "image", label: "Image",    ext: ".png",  color: "#34d399" },
];

/** SVG icon per file type */
function FileTypeIcon({ type, color }: { type: FileType; color: string }) {
  const base = {
    width: 20, height: 20, viewBox: "0 0 24 24" as string,
    fill: "none" as const, stroke: color,
    strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "pdf":
    case "docx":
    case "txt":
      return (
        <svg {...base}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "md":
      return (
        <svg {...base}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="9" y2="11" />
          <polyline points="9 11 12 14 15 11" />
          <line x1="15" y1="15" x2="15" y2="11" />
        </svg>
      );
    case "image":
      return (
        <svg {...base}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    default:
      return (
        <svg {...base}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
}

export function UploadZone({ onFileDrop }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onFileDrop?.(e.dataTransfer.files);
    }
  };

  return (
    <div
      id="knowledge-upload-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex flex-col items-center justify-center gap-5 rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer"
      style={{
        background: isDragging
          ? "rgba(52,211,153,0.06)"
          : "var(--nc-bg-surface)",
        border: `2px dashed ${isDragging ? "rgba(52,211,153,0.5)" : "var(--nc-border)"}`,
        boxShadow: isDragging ? "0 0 0 4px rgba(52,211,153,0.08)" : "none",
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload documents: drag and drop or click to browse"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          // Future: trigger file input
        }
      }}
    >
      {/* Ambient glow */}
      {isDragging && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Upload icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300"
        style={{
          background: isDragging ? "rgba(52,211,153,0.14)" : "rgba(52,211,153,0.08)",
          border: `1px solid ${isDragging ? "rgba(52,211,153,0.4)" : "rgba(52,211,153,0.2)"}`,
        }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <p className="text-base font-semibold mb-1" style={{ color: "var(--nc-text-primary)" }}>
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm" style={{ color: "var(--nc-text-muted)" }}>
          or{" "}
          <span style={{ color: "#34d399", fontWeight: 500 }}>
            click to browse
          </span>
          {" "}from your computer
        </p>
      </div>

      {/* Supported file types */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SUPPORTED_TYPES.map(({ type, label, ext, color }) => (
          <div
            key={type}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{
              background: `color-mix(in srgb, ${color} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
            }}
          >
            <FileTypeIcon type={type} color={color} />
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium leading-none" style={{ color }}>
                {label}
              </span>
              <span className="text-xs leading-none" style={{ color: "var(--nc-text-muted)" }}>
                {ext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Max size hint */}
      <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
        Maximum file size: <strong style={{ color: "var(--nc-text-secondary)" }}>50 MB</strong>
      </p>
    </div>
  );
}
