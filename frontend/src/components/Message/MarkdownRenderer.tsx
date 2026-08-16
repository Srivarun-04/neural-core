import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n') || (className && className.startsWith('language-')))) {
              return (
                <CodeBlock
                  language={match ? match[1] : 'text'}
                  value={codeString}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] font-mono text-xs text-sky-400 dark:text-sky-300 border border-[var(--border-subtle)] font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2.5 last:mb-0 leading-relaxed text-[var(--text-primary)]">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mt-4 mb-2 first:mt-0 tracking-tight">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] mt-3.5 mb-2 first:mt-0 tracking-tight">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm md:text-base font-semibold text-[var(--text-primary)] mt-3 mb-1.5 first:mt-0">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2.5 space-y-1 text-[var(--text-primary)]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-[var(--text-primary)]">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-sky-500 pl-3.5 my-2.5 text-[var(--text-secondary)] italic bg-[var(--bg-card)]/40 py-1 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full text-xs text-left text-[var(--text-primary)]">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] uppercase font-semibold text-[10px]">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-3 py-2 border-b border-[var(--border-subtle)]">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-2 border-b border-[var(--border-subtle)]">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:text-sky-400 underline underline-offset-2 transition-colors font-medium"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
