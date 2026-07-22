/* ─── Knowledge Domain Types ──────────────────────────────────────── */

export type FileType = "pdf" | "docx" | "md" | "txt" | "image" | "other";
export type KnowledgeStatus = "indexed" | "processing" | "uploading" | "failed" | "queued";
export type ProcessingStage = "uploading" | "chunking" | "embedding" | "indexed";

export interface KnowledgeItem {
  id: string;
  title: string;
  fileType: FileType;
  /** Human-readable size, e.g. "2.4 MB" */
  size: string;
  status: KnowledgeStatus;
  uploadDate: string;
  source: string;
  tags?: string[];
  /** Number of chunks after processing */
  chunks?: number;
  /** Brief description or excerpt */
  preview?: string;
}

export interface ProcessingJob {
  id: string;
  fileName: string;
  fileType: FileType;
  stage: ProcessingStage;
  /** Progress 0-100 */
  progress: number;
  size: string;
  startedAt: string;
}

export interface KnowledgeStat {
  label: string;
  value: number | string;
}
