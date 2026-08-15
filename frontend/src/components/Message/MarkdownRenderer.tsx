import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
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
              className="px-1.5 py-0.5 rounded bg-gray-800/80 font-mono text-xs text-purple-300 border border-gray-700/50"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="text-xl font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-semibold text-white mt-3.5 mb-2 first:mt-0">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold text-white mt-3 mb-1.5 first:mt-0">{children}</h3>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-purple-500 pl-3 my-2.5 text-gray-300 italic">
              {children}
            </blockquote>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
