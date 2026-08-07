import React, { useState, useEffect } from 'react';
import { Database, FileText, Layers, Cpu, Server, Upload, RefreshCw, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';

interface DocumentInfo {
  filename: string;
  document_type: string;
  chunk_count: number;
  file_size_bytes: number;
  indexed_at: string;
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
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
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
        message: data.message || `File ${file.name} successfully indexed!`
      });

      // Refresh data instantly
      fetchData();
    } catch (err: any) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to upload document'
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#080B14] text-gray-200">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-purple-400" />
              <span>Knowledge Base & Persistent Index</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage indexed documents, inspect chunk stats, and upload new data directly into the FAISS vector database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
              <span>Refresh Stats</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-purple-900/20 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading & Indexing...' : 'Upload Document'}</span>
              <input
                type="file"
                accept=".txt,.md,.pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Alerts */}
        {uploadStatus && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${uploadStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
            <div className="flex items-center gap-3">
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
            <button onClick={() => setUploadStatus(null)} className="text-gray-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F1424] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Indexed Documents</span>
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white">
                {loading ? '...' : stats?.document_count ?? 0}
              </span>
              <span className="text-xs text-gray-500 block mt-1">Files loaded in data/</span>
            </div>
          </div>

          <div className="bg-[#0F1424] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Vector Chunks</span>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white">
                {loading ? '...' : stats?.total_chunks ?? 0}
              </span>
              <span className="text-xs text-gray-500 block mt-1">Indexed in FAISS</span>
            </div>
          </div>

          <div className="bg-[#0F1424] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Embedding Model</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-semibold text-white block truncate" title={stats?.embedding_model}>
                {loading ? '...' : stats?.embedding_model || 'sentence-transformers'}
              </span>
              <span className="text-xs text-emerald-400 block mt-1">384 Dimensions</span>
            </div>
          </div>

          <div className="bg-[#0F1424] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vector Store</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <HardDrive className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-semibold text-white block">
                {loading ? '...' : stats?.vector_store_status || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500 block mt-1">Disk Persisted</span>
            </div>
          </div>
        </div>

        {/* Document List Table */}
        <div className="bg-[#0F1424] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span>Document Index Manifest</span>
            </h3>
            <span className="text-xs text-gray-400">
              {documents.length} document(s) registered
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm animate-pulse">
              Loading knowledge base manifests...
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm border border-dashed border-gray-800 rounded-xl">
              No documents indexed yet. Upload a TXT, PDF, DOCX, or Markdown file to populate the index.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-gray-900/60 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Chunk Count</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Indexed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-gray-900/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{doc.filename}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-purple-500/10 text-purple-400 uppercase">
                          {doc.document_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-200">
                        {doc.chunk_count} chunks
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {formatBytes(doc.file_size_bytes)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs">
                        {new Date(doc.indexed_at).toLocaleString()}
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
  );
}
