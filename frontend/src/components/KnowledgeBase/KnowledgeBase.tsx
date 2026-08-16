import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Layers,
  Cpu,
  Server,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Trash2,
  Loader2,
  ShieldCheck,
  Lock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { NuraVaultLogo } from '../common/NuraVaultLogo';

interface DocumentInfo {
  filename: string;
  document_type: string;
  chunk_count: number;
  file_size_bytes: number;
  indexed_at: string;
  is_system?: boolean;
  source_type?: string;
}

interface SystemStats {
  document_count: number;
  total_chunks: number;
  embedding_model: string;
  vector_store_status: string;
  status: string;
}

interface KnowledgeBaseProps {
  backendUrl: string;
}

export function KnowledgeBase({ backendUrl }: KnowledgeBaseProps) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await fetch(`${backendUrl}/stats`);
      const docsRes = await fetch(`${backendUrl}/documents`);

      if (!statsRes.ok || !docsRes.ok) {
        throw new Error('Failed to fetch data from backend server.');
      }

      const statsData = await statsRes.json();
      const docsData = await docsRes.json();

      setStats(statsData);
      setDocuments(docsData);
    } catch (err: any) {
      setError(err.message || 'Error connecting to backend server');
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadStatus(null);

    try {
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed');
      }

      setUploadStatus({
        type: 'success',
        message: data.message || `File "${file.name}" successfully indexed into NuraVault!`,
      });

      // Refresh data
      fetchData();
    } catch (err: any) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to upload document',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFile(files[0]);
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteDocument = async (filename: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${filename}" and purge all its vectors from the Knowledge Vault?`
      )
    ) {
      return;
    }

    setDeletingFile(filename);
    setUploadStatus(null);

    try {
      const response = await fetch(`${backendUrl}/documents/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Failed to delete ${filename}`);
      }

      setUploadStatus({
        type: 'success',
        message: data.message || `Document "${filename}" was successfully purged from the vault.`,
      });

      await fetchData();
    } catch (err: any) {
      setUploadStatus({
        type: 'error',
        message: err.message || `Failed to delete document ${filename}`,
      });
    } finally {
      setDeletingFile(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Separate system knowledge from user documents
  const systemDoc = documents.find((doc) => doc.is_system || doc.filename === 'NuraVault System Knowledge');
  const userDocuments = documents.filter((doc) => !doc.is_system && doc.filename !== 'NuraVault System Knowledge');

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--bg-app)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <NuraVaultLogo size={32} />
              <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Knowledge Base
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Your secure knowledge vault. Store and manage documents that NuraVault can understand, vectorize, and retrieve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Index</span>
            </button>

            {/* Primary Explicit Upload Button */}
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl text-xs font-semibold text-white shadow-md shadow-sky-600/20 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : 'active:scale-95'
                }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Indexing Document...' : '+ Upload Document'}</span>
            </button>

            {/* Hidden Input controlled by both drop zone and top-right button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx,.md"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>

        {/* Upload / Deletion Feedback Banner */}
        {uploadStatus && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all ${uploadStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
          >
            <div className="flex items-center gap-2.5">
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
            <button
              onClick={() => setUploadStatus(null)}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* System Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Indexed Documents
              </span>
              <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
                {loading ? '...' : stats?.document_count ?? 0}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                Stored in NuraVault
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Embedded Vectors
              </span>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
                {loading ? '...' : stats?.total_chunks ?? 0}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                FAISS Vector Chunks
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Embedding Model
              </span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span
                className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] block truncate"
                title={stats?.embedding_model}
              >
                {loading ? '...' : stats?.embedding_model || 'sentence-transformers'}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-medium">
                384-Dim Dense Embeddings
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Vector Store
              </span>
              <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] block">
                {loading ? '...' : stats?.vector_store_status || 'Active'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                Disk-Persisted Index
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: NuraVault System Knowledge (Built-In & Protected) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              NuraVault System Knowledge
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-sky-500/20 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      NuraVault Canonical Documentation
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active &amp; Immutable
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
                    NuraVault RAG System The official project specifications, RAG architecture, embedding model info, vector store mechanics, calculator tool instructions, and conversational memory rules.
                  </p>
                </div>
              </div>

              {systemDoc && (
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] sm:border-l sm:border-[var(--border-subtle)] sm:pl-5 flex-shrink-0">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Chunks</span>
                    <span className="font-semibold text-[var(--text-primary)]">{systemDoc.chunk_count} chunks</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Format</span>
                    <span className="font-semibold text-sky-500 uppercase">Markdown</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: User Documents */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Your Documents
              </h3>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {userDocuments.length} user document(s)
            </span>
          </div>

          {/* Unified Clickable Drag & Drop Upload Zone (No inner redundant button) */}
          <div
            onClick={triggerFileInput}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`p-8 md:p-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer shadow-2xs ${isDragging
                ? 'border-sky-500 bg-sky-500/10'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-sky-500/40 hover:bg-[var(--bg-elevated)]/50'
              }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                Upload your knowledge
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Drag &amp; drop documents here or <span className="text-sky-500 font-semibold underline underline-offset-2">click anywhere in this area</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)] pt-0.5">
                PDF • TXT • DOCX • Markdown — Up to 25MB
              </p>
            </div>
          </div>

          {/* User Document Manifest Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-500" />
                <span>Uploaded Documents Manifest</span>
              </h4>
            </div>

            {loading ? (
              <div className="py-12 text-center text-[var(--text-muted)] text-xs sm:text-sm animate-pulse">
                Loading knowledge vault manifests...
              </div>
            ) : userDocuments.length === 0 ? (
              <div className="py-12 text-center text-[var(--text-muted)] text-xs sm:text-sm border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-elevated)]/30">
                Your knowledge vault has no uploaded user documents yet. Drop a file above to index it.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-[var(--text-secondary)]">
                  <thead className="text-[10px] sm:text-xs uppercase bg-[var(--bg-elevated)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                    <tr>
                      <th className="py-2.5 px-3 md:px-4">Filename</th>
                      <th className="py-2.5 px-3 md:px-4">Format</th>
                      <th className="py-2.5 px-3 md:px-4">Chunks</th>
                      <th className="py-2.5 px-3 md:px-4">File Size</th>
                      <th className="py-2.5 px-3 md:px-4 hidden sm:table-cell">Indexed Date</th>
                      <th className="py-2.5 px-3 md:px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {userDocuments.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                        <td className="py-3 px-3 md:px-4 font-medium text-[var(--text-primary)] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                          <span className="truncate max-w-[140px] sm:max-w-xs">{doc.filename}</span>
                        </td>
                        <td className="py-3 px-3 md:px-4">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-500 uppercase border border-sky-500/20">
                            {doc.document_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 md:px-4 font-semibold text-[var(--text-primary)]">
                          {doc.chunk_count}
                        </td>
                        <td className="py-3 px-3 md:px-4 text-[var(--text-muted)]">
                          {formatBytes(doc.file_size_bytes)}
                        </td>
                        <td className="py-3 px-3 md:px-4 text-[var(--text-muted)] text-xs hidden sm:table-cell">
                          {new Date(doc.indexed_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 md:px-4 text-right">
                          <button
                            onClick={() => handleDeleteDocument(doc.filename)}
                            disabled={deletingFile === doc.filename}
                            title={`Permanently delete ${doc.filename}`}
                            aria-label={`Permanently delete ${doc.filename}`}
                            className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {deletingFile === doc.filename ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
