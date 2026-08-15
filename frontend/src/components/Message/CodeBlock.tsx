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
    <div className="my-3 rounded-xl border border-gray-800 bg-[#060913] overflow-hidden shadow-xl text-left">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0B0F1E] border-b border-gray-800/80 text-xs text-gray-400 select-none">
        <span className="font-mono font-medium lowercase tracking-wider text-gray-400">
          {displayLanguage}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied ✓</span>
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
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-gray-200 bg-[#060913]">
        <code>{value}</code>
      </pre>
    </div>
  );
}
