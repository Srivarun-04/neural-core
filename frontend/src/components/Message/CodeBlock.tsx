import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language = 'text', value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code block:', err);
    }
  };

  const displayLanguage = (language || 'code').replace(/^language-/, '').toLowerCase();

  return (
    <div className="my-3.5 rounded-xl border border-[var(--border-subtle)] bg-[#070B16] text-gray-100 overflow-hidden shadow-md text-left">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0E172C] border-b border-gray-800/90 text-xs select-none">
        <div className="flex items-center gap-2 font-mono font-medium text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          <span className="ml-1.5 uppercase tracking-wider text-[10px] text-sky-400 font-semibold">
            {displayLanguage}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/80 transition-all cursor-pointer"
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied ✓</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-gray-200 bg-[#070B16]">
        <code>{value}</code>
      </pre>
    </div>
  );
}
