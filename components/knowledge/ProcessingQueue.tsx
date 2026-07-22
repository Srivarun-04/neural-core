import React from "react";
import type { ProcessingJob, ProcessingStage } from "./types";

interface ProcessingQueueProps {
  jobs: ProcessingJob[];
}

/** Ordered stages for the step indicator */
const STAGES: ProcessingStage[] = ["uploading", "chunking", "embedding", "indexed"];

const STAGE_LABELS: Record<ProcessingStage, string> = {
  uploading:  "Uploading",
  chunking:   "Chunking",
  embedding:  "Embedding",
  indexed:    "Indexed",
};

const STAGE_COLORS: Record<ProcessingStage, string> = {
  uploading:  "#38bdf8",
  chunking:   "#f59e0b",
  embedding:  "#7c6af7",
  indexed:    "#34d399",
};

/** Step pipeline strip */
function StagePipeline({ currentStage }: { currentStage: ProcessingStage }) {
  const currentIdx = STAGES.indexOf(currentStage);

  return (
    <div className="flex items-center gap-1" aria-label={`Current stage: ${STAGE_LABELS[currentStage]}`}>
      {STAGES.map((stage, idx) => {
        const isDone   = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const color = STAGE_COLORS[stage];

        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center gap-1">
              {/* Dot */}
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: isDone || isCurrent ? color : "var(--nc-bg-hover)",
                  boxShadow: isCurrent ? `0 0 6px ${color}` : "none",
                  animation: isCurrent ? "pulse-dot 1.4s ease-in-out infinite" : "none",
                }}
                aria-hidden="true"
              />
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  color: isDone || isCurrent ? color : "var(--nc-text-muted)",
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>

            {/* Connector line */}
            {idx < STAGES.length - 1 && (
              <div
                className="flex-1 h-px mb-3.5 min-w-4 transition-all duration-300"
                style={{
                  background: idx < currentIdx
                    ? STAGE_COLORS[STAGES[idx + 1]]
                    : "var(--nc-border)",
                }}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function ProcessingQueue({ jobs }: ProcessingQueueProps) {
  if (jobs.length === 0) {
    return (
      <section aria-labelledby="queue-heading">
        <h2
          id="queue-heading"
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--nc-text-muted)" }}
        >
          Processing Queue
        </h2>
        <div
          className="flex flex-col items-center justify-center py-8 rounded-2xl text-center gap-2"
          style={{ background: "var(--nc-bg-surface)", border: "1px solid var(--nc-border)" }}
          role="status"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--nc-text-muted)" }} aria-hidden="true">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "var(--nc-text-secondary)" }}>Queue is empty</p>
          <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>Uploaded files will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="queue-heading">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="queue-heading"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--nc-text-muted)" }}
        >
          Processing Queue
        </h2>
        <span
          className="text-xs px-1.5 py-0.5 rounded-md"
          style={{
            background: "rgba(245,158,11,0.1)",
            color: "#fbbf24",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          {jobs.length} active
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => {
          const stageColor = STAGE_COLORS[job.stage];

          return (
            <div
              key={job.id}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                background: "var(--nc-bg-surface)",
                border: "1px solid var(--nc-border)",
              }}
              aria-label={`Processing: ${job.fileName}`}
            >
              {/* File info row */}
              <div className="flex items-center justify-between gap-2">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--nc-text-primary)" }}
                >
                  {job.fileName}
                </p>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--nc-text-muted)" }}>
                  {job.size}
                </span>
              </div>

              {/* Stage pipeline */}
              <StagePipeline currentStage={job.stage} />

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: stageColor }}>
                    {STAGE_LABELS[job.stage]}...
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--nc-text-secondary)" }}>
                    {job.progress}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--nc-bg-elevated)" }}
                  role="progressbar"
                  aria-valuenow={job.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${job.fileName} processing progress`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${job.progress}%`,
                      background: `linear-gradient(90deg, ${stageColor}cc, ${stageColor})`,
                      boxShadow: `0 0 6px ${stageColor}80`,
                    }}
                  />
                </div>
              </div>

              {/* Started at */}
              <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
                Started {job.startedAt}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}
